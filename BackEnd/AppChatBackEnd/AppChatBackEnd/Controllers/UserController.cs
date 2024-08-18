using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using AppChatBackEnd.Models.Entities;


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
        public async Task<IActionResult> AddUser([FromBody] CreateUserRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            // Check if the email already exists
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists)
            {
                return BadRequest("Email already in use. Please use a different email.");
            }

            try
            {
                var newUser = _mapper.Map<Users>(request);
                newUser.Password = HashPassword(request.Password);  // Hash the password before saving
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User added successfully.", userId = newUser.UserId });
            }
            catch (Exception ex)
            {
                // Log the exception details here for further investigation
                return StatusCode(500, "An error occurred while adding the user: " + ex.Message);
            }
        }


        [HttpDelete("remove-user/{id}")]
        public async Task<IActionResult> RemoveUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("User not found.");

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok("User removed successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception details here
                return StatusCode(500, "An error occurred while removing the user: " + ex.Message);
            }
        }

        // Helper method to hash passwords
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                // Fetch only the necessary fields
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                    })
                    .ToListAsync();

                return Ok(users); // Returns only the selected fields in JSON format
            }
            catch (Exception ex)
            {
                // Log the exception details here for further investigation
                return StatusCode(500, "An error occurred while fetching the users: " + ex.Message);
            }
        }

        [HttpGet("count-users")]
        public async Task<IActionResult> CountUsers()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                return Ok(userCount); // Trả về số lượng người dùng
            }
            catch (Exception ex)
            {
                // Ghi log chi tiết ngoại lệ để điều tra thêm
                return StatusCode(500, "An error occurred while counting the users: " + ex.Message);
            }
        }


        // cậo nhật user profile
        [HttpPut("update-user-infor-profile")]
        public async Task<IActionResult> UpdateUserInforProfile([FromBody] UpdateUserInforProfileRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.Users
                .Include(u => u.UserDetail)
                .FirstOrDefaultAsync(u => u.UserId == request.UserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            //var newUser = _mapper.Map<Users>(request);
            if (request.UserName != null)
                user.UserName = request.UserName;
            if (request.Gender != null)
                user.UserDetail.Gender = request.Gender;
            if (request.DateOfBirth != null)
                user.UserDetail.Dob = request.DateOfBirth;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User profile updated successfully." });
        }

        // cậo nhật user avatar
        [HttpPut("update-user-avatar")]
        public async Task<IActionResult> UpdateUserAvatar([FromBody] UpdateUserAvatarRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            //var newUser = _mapper.Map<Users>(request);
            if (request.Img != null)
                user.Img = request.Img;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User avatar updated successfully." });
        }

        // report user
        [HttpPut("report-user")]
        public async Task<IActionResult> ReportUser([FromBody] ReportUserRequestDTO request)
        {
            var userReported = await _context.Users
             .Include(u => u.UserDetail)
             .FirstOrDefaultAsync(u => u.UserId == request.ReportedUserId);

            if (userReported == null)
            {
              return NotFound("Hệ thống không tìm thấy user bị report với ID này, đảm bảo bạn đã report đúng ID");
            }

            var userReporting = await _context.Users
              .Include(u => u.UserDetail)
              .FirstOrDefaultAsync(u => u.UserId == request.ReportingUserId);

            if (userReporting == null)
            {
              return NotFound("Hệ thống không tìm thấy user đang report với ID này");
            }

            if (userReporting.UserId == userReported.UserId)
            {
                return BadRequest("Bạn không được tự report bản thân");
            }

            // tìm dòng gần nhất mà id người A report id người B trong bảng reports
            var report = await _context.Reports
            .Where(r => r.ReportingUserId == request.ReportingUserId && r.ReportedUserId == request.ReportedUserId)
            .OrderByDescending(r => r.Timestamp)
            .FirstOrDefaultAsync();

            if (report != null)
            {
                // check xem người A có report người B trong 1 time ngắn ko?
                DateTime nearestReportingUtcTime = report.Timestamp;
                DateTime nowUtcTime = DateTime.UtcNow;
                TimeSpan timeDifference = nowUtcTime - nearestReportingUtcTime;
                // Kiểm tra nếu thời gian chênh lệch nhỏ hơn hoặc bằng 1 phút
                if (timeDifference <= TimeSpan.FromMinutes(1))
                {
                    return BadRequest($"Bạn không được spam report, hãy chờ {60-timeDifference.TotalSeconds} giây");
                }
            }

            var newReport = new Reports
            {
                ReportingUserId = request.ReportingUserId,
                ReportedUserId = request. ReportedUserId,
                Reason = request.Reason,
                Timestamp = DateTime.UtcNow
            };

            await _context.Reports.AddAsync(newReport);
            userReported.UserDetail.reportAmount++;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User reportAmount updated successfully." });
        }

    }
}
