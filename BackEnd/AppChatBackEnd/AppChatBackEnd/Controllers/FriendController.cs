using AppChat.Data;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChat.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public FriendController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("find-friend/{username}")]
        public async Task<IActionResult> FindFriend(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);  // Adjust the property name as per your Users entity
            if (user == null)
                return NotFound("User not found.");
            var userDTO = _mapper.Map<UserDTO>(user);
            return Ok(userDTO);
        }

        [HttpPost("add-friend")]
        public async Task<IActionResult> AddFriend([FromBody] FriendRequestDTO requestDto)
        {
            var user = await _context.Users.FindAsync(requestDto.UserId);
            var friend = await _context.Users.FindAsync(requestDto.FriendUserId);
            if (user == null || friend == null)
                return NotFound("User or friend not found.");

            var existingFriendship = await _context.Friends.FirstOrDefaultAsync(f => f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId);
            if (existingFriendship != null)
                return BadRequest("Friendship already exists.");

            var friendship = new Friend
            {
                UserId = requestDto.UserId,
                FriendUserId = requestDto.FriendUserId,
                Status = FriendStatus.Pending  // Hoặc trạng thái mặc định khác
            };

            _context.Friends.Add(friendship);
            await _context.SaveChangesAsync();
            return Ok("Friend added successfully.");
        }

        [HttpDelete("delete-friend")]
        public async Task<IActionResult> DeleteFriend([FromBody] FriendRequestDTO requestDto)
        {
            var friendship = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId) ||
                (f.UserId == requestDto.FriendUserId && f.FriendUserId == requestDto.UserId));

            if (friendship == null)
            {
                return NotFound("Friendship not found.");
            }

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();
            return Ok("Friend deleted successfully.");
        }
    }
}
