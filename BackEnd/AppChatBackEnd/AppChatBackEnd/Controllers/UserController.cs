using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using AppChatBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


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
        [Authorize(Policy = "RoleBasedPolicy")]
         public async Task<IActionResult> AddUser([FromBody] CreateUserRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            // Check if the role exists in the database
            var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == request.RoleId);
            if (!roleExists)
            {
                return BadRequest("Invalid RoleId. Please provide a valid role.");
            }

            // Check if the email already exists
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists)
            {
                return BadRequest("Email already in use. Please use a different email.");
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Map CreateUserRequestDTO to Users entity
                    var newUser = _mapper.Map<Users>(request);
                    newUser.Password = HashPassword(request.Password); // Hash the password before saving

                    // Create UserDetails with default information and status
                    var userDetails = new UserDetails
                    {
                        FirstName = newUser.UserName, // Giả sử tên người dùng là tên đầu tiên
                        LastName = string.Empty, // Để trống hoặc sử dụng thông tin khác nếu có
                        Status = "Active", // Đặt trạng thái mặc định là Active
                        User = newUser // Liên kết với người dùng
                    };

                    // Gán UserDetails vào đối tượng Users
                    newUser.UserDetail = userDetails;

                    // Lưu cả Users và UserDetails
                    await _context.Users.AddAsync(newUser);
                    await _context.SaveChangesAsync();

                    // Commit transaction
                    await transaction.CommitAsync();

                    return Ok(new { message = "User added successfully.", userId = newUser.UserId });
                }
                catch (DbUpdateException ex)
                {
                    // Rollback transaction if something goes wrong
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Database error occurred while adding        `the user: " + (ex.InnerException?.Message ?? ex.Message));
                }
                catch (Exception ex)
                {
                    // Rollback transaction if something goes wrong
                    await transaction.RollbackAsync();
                    return StatusCode(500, "An unexpected error occurred while adding the user: " + ex.Message);
}
            }
        }


        [HttpDelete("remove-user/{id}")]
        [Authorize(Policy = "RoleBasedPolicy")]
        public async Task<IActionResult> RemoveUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("User not found.");

                // Remove associated reports
                var reports = _context.Reports.Where(r => r.ReportedUserId == id || r.ReportingUserId == id);
                _context.Reports.RemoveRange(reports);

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
                // Fetch necessary fields including status from UserDetails and role from Role
                var users = await _context.Users
                    .Include(u => u.UserDetail) // Include UserDetails
                    .Include(u => u.Role) // Include Role
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                        Status = u.UserDetail.Status, // Lấy Status từ bảng UserDetails
                        Role = u.Role.RoleName, // Lấy tên Role từ bảng Role
                        u.Img
                    })
                    .ToListAsync();

                return Ok(users); // Returns the selected fields in JSON format
            }
            catch (Exception ex)
            {
                // Log the exception details here for further investigation
                return StatusCode(500, "An error occurred while fetching the users: " + ex.Message);
            }
        }


        // API to count active users
        [HttpGet("count-users")]
        public async Task<IActionResult> CountUsers()
        {
            try
            {
                var userCount = await _context.Users
                    .Where(u => u.UserDetail.Status == "Active" || u.UserDetail.Status == "Reported")
                    .CountAsync();
                return Ok(userCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while counting users: " + ex.Message);
            }
        }


        // API to count blocked users
        [HttpGet("count-blocked-users")]
        public async Task<IActionResult> CountBlockedUsers()
        {
            try
            {
                var blockedUserCount = await _context.Users
                    .Where(u => u.UserDetail.Status == "Blocked")
                    .CountAsync();
                return Ok(blockedUserCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while counting blocked users: " + ex.Message);
            }
        }

        // API to count reported users
        [HttpGet("count-reports")]
        public async Task<IActionResult> CountReports()
        {
            try
            {
                var totalReports = await _context.Users
                    .SumAsync(u => u.UserDetail.reportAmount);
                return Ok(totalReports);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while counting reports: " + ex.Message);
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
            try
            {
                // Lấy thông tin user từ token
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null)
                {
                    return Unauthorized("Invalid token.");
                }

                // Lấy email từ JWT token
                var emailClaim = identity.FindFirst(ClaimTypes.Email);
                if (emailClaim == null)
                {
                    return Unauthorized("Email not found in token.");
                }

                string email = emailClaim.Value;

                // Truy vấn UserId dựa trên email
                var reportingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email);

                if (reportingUser == null)
                {
                    return Unauthorized("User not found.");
                }

                int reportingUserId = reportingUser.UserId;

                // Tìm người dùng bị báo cáo
                var userReported = await _context.Users
                    .Include(u => u.UserDetail)
                    .FirstOrDefaultAsync(u => u.UserId == request.ReportedUserId);

                if (userReported == null)
                {
                    return NotFound("User not found for reporting.");
                }

                // Tăng số lượng report và cập nhật trạng thái
                userReported.UserDetail.reportAmount += 1;
                userReported.UserDetail.Status = "Reported";

                // Tạo một mục report mới
                var newReport = new Reports
                {
                    ReportingUserId = reportingUserId, // Lấy từ truy vấn
                    ReportedUserId = request.ReportedUserId,
                    Reason = request.Reason,
                    Timestamp = DateTime.UtcNow
                };

                await _context.Reports.AddAsync(newReport);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User reported successfully, status and reportAmount updated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while reporting the user: " + ex.Message);
            }
        }



        [HttpPut("block-user/{id}")]
        [Authorize(Policy = "RoleBasedPolicy")]
        public async Task<IActionResult> BlockUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserDetail)
                    .FirstOrDefaultAsync(u => u.UserId == id);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Kiểm tra nếu người dùng đã bị block
                if (user.UserDetail.Status == "Blocked")
                {
                    return BadRequest("User is already blocked.");
                }

                // Cập nhật trạng thái thành "Blocked"
                user.UserDetail.Status = "Blocked";
                await _context.SaveChangesAsync();

                return Ok(new { message = "User blocked successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception details here
                return StatusCode(500, "An error occurred while blocking the user: " + ex.Message);
            }
        }

        [HttpPut("unblock-user/{id}")]
        [Authorize(Policy = "RoleBasedPolicy")]
        public async Task<IActionResult> UnblockUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserDetail)
                    .FirstOrDefaultAsync(u => u.UserId == id);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Kiểm tra nếu người dùng chưa bị block
                if (user.UserDetail.Status != "Blocked")
                {
                    return BadRequest("User is not blocked.");
                }

                // Cập nhật trạng thái thành "Active"
                user.UserDetail.Status = "Active";
                await _context.SaveChangesAsync();

                return Ok(new { message = "User unblocked successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception details here
                return StatusCode(500, "An error occurred while unblocking the user: " + ex.Message);
            }
        }

        [HttpGet("all-reports")]
        public async Task<IActionResult> GetAllReports()
        {
            try
            {
                var reports = await _context.Reports
                    .Include(r => r.ReportedUser)
                    .ThenInclude(u => u.UserDetail)
                    .Select(r => new
                    {
                        r.ReportId,
                        r.ReportedUserId,
                        r.ReportingUserId,
                        r.Reason,
                        r.Timestamp,
                        ReportedUserReportAmount = r.ReportedUser.UserDetail.reportAmount
                    })
                    .ToListAsync();

                return Ok(reports);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching reports: " + ex.Message);
            }
        }

        [HttpGet("getReportsByUserId/{userId}")]
        public async Task<IActionResult> GetReportsByUserId(int userId)
        {
            var userReports = await _context.Reports
                .Where(r => r.ReportedUserId == userId)
                .Select(r => new
                {
                    r.ReportId,
                    r.ReportingUserId,
                    r.Reason,
                    r.Timestamp,
                    ReportedUserName = r.ReportedUser.UserName, // Lấy UserName
                    ReportedUserReportAmount = r.ReportedUser.UserDetail.reportAmount // Lấy reportAmount
                })
                .ToListAsync();

            if (userReports == null || userReports.Count == 0)
            {
                return NotFound("No reports found for this user.");
            }

            return Ok(userReports);
        }

        // Get user by ID
        [HttpGet("get-user-by-id/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserDetail)
                    .Include(u => u.Role)
                    .Where(u => u.UserId == id)
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                        Status = u.UserDetail.Status,
                        Role = u.Role.RoleName,
                        u.Img
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while getting user by ID: " + ex.Message);
            }
        }

        // Get users by Name
        [HttpGet("get-users-by-name/{name}")]
        public async Task<IActionResult> GetUsersByName(string name)
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.UserDetail)
                    .Include(u => u.Role)
                    .Where(u => u.UserName.Contains(name))
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                        Status = u.UserDetail.Status,
                        Role = u.Role.RoleName,
                        u.Img
                    })
                    .ToListAsync();

                if (users == null || users.Count == 0)
                {
                    return NotFound("No users found with the given name.");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while getting users by name: " + ex.Message);
            }
        }

        // Get users by Email
        [HttpGet("get-users-by-email/{email}")]
        public async Task<IActionResult> GetUsersByEmail(string email)
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.UserDetail)
                    .Include(u => u.Role)
                    .Where(u => u.Email.Contains(email))
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                        Status = u.UserDetail.Status,
                        Role = u.Role.RoleName,
                        u.Img
                    })
                    .ToListAsync();

                if (users == null || users.Count == 0)
                {
                    return NotFound("No users found with the given email.");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while getting users by email: " + ex.Message);
            }
        }

        [HttpGet("get-reports-by-reported-user-id/{reportedUserId}")]
        public async Task<IActionResult> GetReportsByReportedUserId(int reportedUserId)
        {
            var reports = await _context.Reports
                .Include(r => r.ReportedUser)
                .ThenInclude(u => u.UserDetail)
                .Where(r => r.ReportedUserId == reportedUserId)
                .Select(r => new
                {
                    r.ReportId,
                    r.ReportedUserId,
                    r.ReportingUserId,
                    r.Reason,
                    r.Timestamp,
                    ReportedUserReportAmount = r.ReportedUser.UserDetail.reportAmount
                })
                .ToListAsync();

            if (reports == null || reports.Count == 0)
            {
                return NotFound("No reports found for this user.");
            }

            return Ok(reports);
        }


    }
}
