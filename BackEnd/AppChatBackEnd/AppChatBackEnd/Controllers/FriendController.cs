using AppChat.Data;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChat.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AppChatBackEnd.Controllers
{
    [Route("api/friend-controller")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FriendController> _logger;

        public FriendController(DataContext context, IMapper mapper, ILogger<FriendController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        [HttpGet("find-potential-friends")]
        public async Task<IActionResult> FindPotentialFriends([FromQuery] string email, [FromQuery] string? username)
        {
            // Find the current user by their email
            var currentUser = await _context.Users
                .Include(u => u.Friends) // Include the Friends relationship
                .FirstOrDefaultAsync(u => u.Email == email);

            if (currentUser == null)
            {
                return NotFound("User not found");
            }

            // Get the list of IDs of the current user's friends and pending requests
            var friendStatuses = currentUser.Friends
                .GroupBy(f => f.FriendUserId)
                .Select(g => new
                {
                    FriendUserId = g.Key,
                    Status = g.Max(f => f.Status) // Take the most recent status
                })
                .ToDictionary(x => x.FriendUserId, x => x.Status);

            // Fetch potential friends from the database
            var potentialFriendsQuery = _context.Users
                .Where(u =>
                    u.UserId != currentUser.UserId // Exclude the current user
                    && (username == null || u.UserName.Contains(username)) // Optional username search
                );

            var potentialFriends = await potentialFriendsQuery.ToListAsync();

            // Filter the results to include users who are either not friends or have a pending request
            var result = potentialFriends
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    Username = u.UserName,
                    Img = u.Img,
                    Email = u.Email,
                    FriendStatus = friendStatuses.ContainsKey(u.UserId) ? friendStatuses[u.UserId] : (FriendStatus?)null
                })
                .Where(dto => dto.FriendStatus == FriendStatus.Pending || dto.FriendStatus == null) // Include pending requests or users not in friendStatuses
                .ToList();

            // Return the appropriate response based on the results
            return Ok(result);
        }

        [HttpPost("send-friend-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDTOVuLuu request)
        {
            // Find the sender and recipient by their email addresses
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.SenderEmail);
            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.RecipientEmail);

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            // Check if a pending or existing friend request already exists
            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == sender.UserId && f.FriendUserId == recipient.UserId);

            if (existingRequest != null)
            {
                if (existingRequest.Status == FriendStatus.Pending)
                {
                    return Conflict("A pending friend request already exists");
                }
                // Optionally handle other cases like already friends
                return Conflict("A friend request already exists");
            }

            // Create a new friend request
            var newFriendRequest = new Friend
            {
                UserId = sender.UserId,
                FriendUserId = recipient.UserId,
                Status = FriendStatus.Pending
            };

            _context.Friends.Add(newFriendRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent successfully");
        }
        [HttpPost("cancel-friend-request")]
        public async Task<IActionResult> CancelFriendRequest([FromBody] FriendRequestDTOVuLuu request)
        {
            // Find the sender and recipient by their email addresses
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.SenderEmail);
            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.RecipientEmail);

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            // Find the pending friend request
            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == sender.UserId && f.FriendUserId == recipient.UserId && f.Status == FriendStatus.Pending);

            if (existingRequest == null)
            {
                return NotFound("No pending friend request found to cancel");
            }

            // Remove the pending friend request
            _context.Friends.Remove(existingRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request canceled successfully");
        }

        [HttpDelete("delete-friend")]
        public async Task<IActionResult> DeleteFriend([FromBody] FriendRequestDTO requestDto)
        {
            if (requestDto == null)
            {
                return BadRequest("Invalid request data.");
            }

            // Find both friendship records
            var friendships = await _context.Friends
                .Where(f => (f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId) ||
                            (f.UserId == requestDto.FriendUserId && f.FriendUserId == requestDto.UserId))
                .ToListAsync();

            if (!friendships.Any())
            {
                return NotFound("Friendship not found.");
            }

            // Remove both entries
            _context.Friends.RemoveRange(friendships);
            await _context.SaveChangesAsync();

            return Ok("Friendship deleted successfully.");
        }

        [HttpPost("confirm-friend")]
        public async Task<IActionResult> ConfirmFriend(int userId, int friendUserId, bool isAccepted)
        {
            // Find both friendship records
            var friendships = await _context.Friends
                .Where(f => (f.UserId == userId && f.FriendUserId == friendUserId) ||
                            (f.UserId == friendUserId && f.FriendUserId == userId))
                .ToListAsync();

            if (!friendships.Any())
            {
                return NotFound("Friendship not found.");
            }

            if (isAccepted) // Accepted
            {
                // Update both entries to Accepted
                foreach (var friendship in friendships)
                {
                    friendship.Status = FriendStatus.Accepted; // Use enum
                }
                await _context.SaveChangesAsync();
                return Ok("Friend request accepted.");
            }
            else // Declined
            {
                // Remove both entries
                _context.Friends.RemoveRange(friendships);
                await _context.SaveChangesAsync();
                return Ok("Friend request declined and removed.");
            }
        }
    }
}
