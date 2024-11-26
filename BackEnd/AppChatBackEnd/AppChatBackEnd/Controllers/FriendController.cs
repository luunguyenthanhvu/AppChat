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
using System.Linq;
using Org.BouncyCastle.Cms;

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
                .FirstOrDefaultAsync(u => u.Email == email);

            if (currentUser == null)
            {
                return NotFound("User not found");
            }

            // Get the list of friend relationships for the current user
            var friendStatuses = await _context.Friends
                .Where(f => f.UserId == currentUser.UserId)
                .ToListAsync();

            var friendStatusDict = friendStatuses
                .GroupBy(f => f.FriendUserId)
                .ToDictionary(g => g.Key, g => g.Max(f => f.Status));

            // Fetch potential friends from the database
            var potentialFriendsQuery = _context.Users
                .Where(u =>
                    u.UserId != currentUser.UserId // Exclude the current user
                    && (username == null || u.UserName.Contains(username)) // Optional username search
                );

            // Fetch pending requests where the current user is the recipient
            var pendingRequests = await _context.Friends
                .Where(f => f.FriendUserId == currentUser.UserId && f.Status == FriendStatus.Pending)
                .Select(f => f.UserId)
                .ToArrayAsync(); // Use HashSet for quick lookup

            var potentialFriends = await potentialFriendsQuery.ToListAsync();

            // Map potential friends to DTOs
            var resultList = potentialFriends
                .Select(u =>
                {
                    var friendStatus = friendStatusDict.ContainsKey(u.UserId) ? friendStatusDict[u.UserId] : (FriendStatus?)null;

                    return new UserRequestSearchFriendDTO
                    {
                        UserId = u.UserId,
                        Username = u.UserName,
                        Img = u.Img,
                        Email = u.Email,
                        FriendStatus = friendStatus,
                        RequestSender = friendStatus == FriendStatus.Pending && pendingRequests.Contains(u.UserId) ? u.Email : null
                    };
                })
                .Where(dto => dto.FriendStatus == FriendStatus.Pending || dto.FriendStatus == null) // Include pending requests or users not in friendStatuses
                .ToList();

            return Ok(resultList);
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
        public async Task<IActionResult> DeleteFriend([FromQuery] string userEmail, [FromQuery] int friendId)
        {
            if (string.IsNullOrEmpty(userEmail) || friendId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            // Lấy người dùng hiện tại
            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userEmail);

            if (currentUser == null)
            {
                return NotFound("Current user not found.");
            }

            var friendships = await _context.Friends
                .Where(f => (f.UserId == currentUser.UserId && f.FriendUserId == friendId) ||
                            (f.UserId == friendId && f.FriendUserId == currentUser.UserId))
                .ToListAsync();

            if (!friendships.Any())
            {
                return NotFound("Friendship not found.");
            }


            _context.Friends.RemoveRange(friendships);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpGet("pending-friend-requests")]
        public async Task<IActionResult> GetPendingFriendRequests([FromQuery] string email)
        {
            // Find the current user by their email
            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (currentUser == null)
            {
                return NotFound("User not found");
            }

            // Get the list of pending friend requests where the current user is the recipient
            var pendingRequests = await _context.Friends
                .Include(f => f.User) // Include the sender's user details
                .Where(f => f.FriendUserId == currentUser.UserId && f.Status == FriendStatus.Pending)
                .Select(f => new UserDTO
                {
                    UserId = f.User.UserId,
                    Username = f.User.UserName,
                    Email = f.User.Email,
                    Img = f.User.Img
                })
                .ToListAsync();

            if (!pendingRequests.Any())
            {
                return Ok(new List<UserDTO>());
            }

            return Ok(pendingRequests);
        }

        [HttpPost("send-friend-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDTOVuLuu request)
        {
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.SenderEmail);
            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.RecipientEmail);

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            // Check for existing request from recipient to sender
            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == recipient.UserId && f.FriendUserId == sender.UserId);

            if (existingRequest != null)
            {
                if (existingRequest.Status == FriendStatus.Pending)
                {
                    // Update existing request from recipient to sender to Accepted
                    existingRequest.Status = FriendStatus.Accepted;
                    _context.Friends.Update(existingRequest);

                    // Create reciprocal relationship
                    var reciprocalFriend = new Friend
                    {
                        UserId = sender.UserId,
                        FriendUserId = recipient.UserId,
                        Status = FriendStatus.Accepted
                    };

                    // Create a message to notify the sender
                    var message = new Message
                    {
                        SenderId = recipient.UserId,
                        ReceiverId = sender.UserId,
                        Content = $"Hello {sender.UserName}, I have accepted your friend request <3.",
                        Timestamp = DateTime.Now,
                        isImage = false
                    };

                    // Add to the context
                    _context.Friends.Add(reciprocalFriend);
                    _context.Messages.Add(message);

                    await _context.SaveChangesAsync();

                    return Ok("Friend request accepted and notification sent");
                }
                else if (existingRequest.Status == FriendStatus.Accepted)
                {
                    return BadRequest("You are already friends");
                }
            }

            // Create a new friend request if none exist
            var newRequest = new Friend
            {
                UserId = sender.UserId,
                FriendUserId = recipient.UserId,
                Status = FriendStatus.Pending
            };

            _context.Friends.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent");
        }


        [HttpPost("accept-friend-request")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] FriendRequestDTOVuLuu request)
        {
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.SenderEmail);
            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.RecipientEmail);

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => (f.UserId == sender.UserId && f.FriendUserId == recipient.UserId) && f.Status == FriendStatus.Pending);

            if (existingRequest == null)
            {
                return NotFound("No pending friend request found");
            }

            existingRequest.Status = FriendStatus.Accepted;

            var reciprocalFriend = new Friend
            {
                UserId = recipient.UserId,
                FriendUserId = sender.UserId,
                Status = FriendStatus.Accepted
            };

            var message = new Message
            {
                SenderId = recipient.UserId,
                ReceiverId = sender.UserId,
                Content = $"Hello {sender.UserName}, I have accepted your request <3.",
                Timestamp = DateTime.Now,
                isImage = false
            };

            _context.Friends.Add(reciprocalFriend);
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok("Friend request accepted");
        }

        [HttpPost("decline-friend-request")]
        public async Task<IActionResult> DeclineFriendRequest([FromBody] FriendRequestDTOVuLuu request)
        {
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.SenderEmail);
            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.RecipientEmail);

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => (f.UserId == sender.UserId && f.FriendUserId == recipient.UserId) && f.Status == FriendStatus.Pending);

            if (existingRequest == null)
            {
                return NotFound("No pending friend request found");
            }

            _context.Friends.Remove(existingRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request declined");
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
