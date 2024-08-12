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
    [Route("api/[controller]")]
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

        [HttpGet("find-friend/{username}")]
        public async Task<IActionResult> FindFriend(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null)
                return NotFound("User not found.");

            var userDTO = _mapper.Map<UserDTO>(user);
            return Ok(userDTO);
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
