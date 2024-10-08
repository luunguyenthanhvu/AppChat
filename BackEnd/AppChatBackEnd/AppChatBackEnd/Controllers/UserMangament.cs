﻿using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.Models.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // Lấy ra tất cả người dùng
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.UserDetail)
                    .Include(u => u.Role) 
                    .Select(u => new
                    {
                        u.UserId,
                        u.UserName,
                        u.Email,
                        Status = u.UserDetail.Status, 
                        Role = u.Role.RoleName 
                    })
                    .ToListAsync();

                return Ok(users); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Lấy ra người dùng theo ID
        [HttpGet("get-users/{id}")]
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
                        u.Img,
                        u.RoleId // Include RoleId
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { message = "User not found!" });
                }

                return Ok(user); // Return the user data directly
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the user: " + ex.Message);
            }
        }


        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserRequestDTO request)
        {
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
                    await transaction.RollbackAsync();
                    return Ok(new { message = "User added successfully.", userId = newUser.UserId });
                }
                catch (DbUpdateException ex)
                {
                    // Rollback transaction if something goes wrong
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Database error occurred while adding the user: " + (ex.InnerException?.Message ?? ex.Message));
                }
                catch (Exception ex)
                {
                    // Rollback transaction if something goes wrong
                    await transaction.RollbackAsync();
                    return StatusCode(500, "An unexpected error occurred while adding the user: " + ex.Message);
                }
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found!" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while deleting the user: " + ex.Message);
            }
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] CreateUserRequestDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found!" });
                }

                user.UserName = userDTO.UserName;
                user.Email = user.Email;
                user.RoleId = userDTO.RoleId; // Update RoleId

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating the user: " + ex.Message);
            }
        }


        [HttpPatch("ChangeUserRole/{id}")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] int newRoleId)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found!" });
                }

                user.RoleId = newRoleId; // Change RoleId

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while changing the user's role: " + ex.Message);
            }
        }




        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

    }



}
