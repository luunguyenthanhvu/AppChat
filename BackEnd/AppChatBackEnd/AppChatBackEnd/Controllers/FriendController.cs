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

            // Get the list of IDs of the current user's friends
            var friendUserIds = currentUser.Friends.Select(f => f.FriendUserId).ToList();

            // Search for potential friends based on username and not being in the current user's friend list
            var potentialFriendsQuery = _context.Users
                .Where(u =>
                    u.UserId != currentUser.UserId && // Exclude the current user
                    !friendUserIds.Contains(u.UserId) && // Exclude already friends
                    (username == null || u.UserName.Contains(username)) // Optional username search
                );

            // Project the result to a UserDTO or similar structure
            var potentialFriends = await potentialFriendsQuery
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    Username = u.UserName,
                    Img = u.Img,
                    Email = u.Email
                })
                .ToListAsync();

            // Return the appropriate response based on the results
            if (!potentialFriends.Any())
            {
                return Ok(new List<UserDTO>()); 
            }

            return Ok(potentialFriends); // Return the list of potential friends
        }


        [HttpPost("add-friend")]
        public async Task<IActionResult> AddFriend([FromBody] FriendRequestDTO requestDto)
        {
            if (requestDto == null)
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.Users.FindAsync(requestDto.UserId);
            var friend = await _context.Users.FindAsync(requestDto.FriendUserId);

            if (user == null || friend == null)
            {
                return NotFound("User or friend not found.");
            }

            // Check if the friendship already exists in either direction
            bool friendshipExists = await _context.Friends.AnyAsync(f =>
                (f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId) ||
                (f.UserId == requestDto.FriendUserId && f.FriendUserId == requestDto.UserId));

            if (friendshipExists)
            {
                return BadRequest("Friendship already exists.");
            }

            // Create two friendship entries for both directions
            var friendship1 = new Friend
            {
                UserId = requestDto.UserId,
                FriendUserId = requestDto.FriendUserId,
                Status = FriendStatus.Pending // Use enum instead of magic number
            };

            var friendship2 = new Friend
            {
                UserId = requestDto.FriendUserId,
                FriendUserId = requestDto.UserId,
                Status = FriendStatus.Pending // Use enum instead of magic number
            };

            _context.Friends.Add(friendship1);
            _context.Friends.Add(friendship2);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent successfully.");
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
