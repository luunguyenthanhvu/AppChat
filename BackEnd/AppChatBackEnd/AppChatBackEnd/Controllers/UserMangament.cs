using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AppChatBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserManagementController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserManagementController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // lấy ra tất cả người dùng
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<Users>>> GetAllUsers()
        {
            try
            {
                return await _context.Users.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // lấy ra users theo id
        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<Users>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // Cập nhật thông tin người dùng
        // PUT: api/UserManagement/UpdateUser/5
        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] CreateUserRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.UserName = request.UserName;
            user.Email = request.Email;
            user.Img = request.Img;
            user.RoleId = request.RoleId;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!UserExists(id))
                {
                    return NotFound("User not found");
                }
                else
                {
                    return StatusCode(500, $"Database concurrency error: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }

        // Thêm người dùng
        [HttpPost("AddUser")]
        public async Task<ActionResult<Users>> AddUser([FromBody] CreateUserRequestDTO request)
        {
            try
            {
                var user = new Users
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    Password = request.Password,
                    Img = request.Img,
                    RoleId = request.RoleId
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserById), new { id = user.UserId }, user);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Xóa người dùng
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Đổi Role
        [HttpPatch("ChangeRole/{id}")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] int newRoleId)
        {
            try
            {
                var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == id);
                if (user == null)
                {
                    return NotFound();
                }

                var newRole = await _context.Roles.FindAsync(newRoleId);
                if (newRole == null)
                {
                    return BadRequest("Invalid role ID");
                }

                user.RoleId = newRoleId;
                user.Role = newRole;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
