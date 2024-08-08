using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using AppChat.DTO.Request;
using AppChat.DTO.Response;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpPost("add-user")]
        public IActionResult AddUser([FromBody] CreateUserRequestDTO request)
        {
            var newUser = _mapper.Map<Users>(request);
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok(new { message = "User added successfully.", userId = newUser.UserId });
        }

        [HttpDelete("remove-user/{id}")]
        public IActionResult RemoveUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("User not found.");

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok("User removed successfully.");
        }
    }
}
