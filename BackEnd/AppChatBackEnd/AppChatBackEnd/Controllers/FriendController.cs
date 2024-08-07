using AppChat.Data;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChat.Models.Enums;


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
        public IActionResult FindFriend(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == username);  // Adjust the property name as per your Users entity
            if (user == null)
                return NotFound("User not found.");
            var userDTO = _mapper.Map<UserDTO>(user);
            return Ok(userDTO);
        }


        [HttpPost("add-friend")]
        public IActionResult AddFriend([FromBody] FriendRequestDTO requestDto)
        {
            var user = _context.Users.Find(requestDto.UserId);
            var friend = _context.Users.Find(requestDto.FriendUserId);  // Sử dụng FriendUserId thay vì FriendId
            if (user == null || friend == null)
                return NotFound("User or friend not found.");

            // Kiểm tra nếu quan hệ đã tồn tại
            var existingFriendship = _context.Friends.FirstOrDefault(f => f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId);
            if (existingFriendship != null)
                return BadRequest("Friendship already exists.");

            // Tạo mới quan hệ bạn bè
            var friendship = new Friend
            {
                UserId = requestDto.UserId,
                FriendUserId = requestDto.FriendUserId,
                Status = FriendStatus.Pending // Hoặc trạng thái mặc định khác
            };

            _context.Friends.Add(friendship);
            _context.SaveChanges();
            return Ok("Friend added successfully.");
        }


        [HttpDelete("delete-friend")]
        public IActionResult DeleteFriend([FromBody] FriendRequestDTO requestDto)
        {
            // This query checks for both possible combinations of userId and friendUserId.
            var friendship = _context.Friends.FirstOrDefault(f =>
                (f.UserId == requestDto.UserId && f.FriendUserId == requestDto.FriendUserId) ||
                (f.UserId == requestDto.FriendUserId && f.FriendUserId == requestDto.UserId));

            if (friendship == null)
            {
                return NotFound("Friendship not found.");
            }

            _context.Friends.Remove(friendship);
            _context.SaveChanges();
            return Ok("Friend deleted successfully.");
        }


    }
}
