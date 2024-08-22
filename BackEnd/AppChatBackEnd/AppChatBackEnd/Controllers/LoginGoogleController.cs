using AppChat.Data;
using AppChat.DTO.Response;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.Models.Entities;
using AppChatBackEnd.Models.SecretKeyModel;
using AppChatBackEnd.Services.template;
using AppChatBackEnd.utils;
using AutoMapper;
using MailKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginGoogleController : ControllerBase
    {
        private readonly DataContext _context;
        private ISendDataLogin sendDataLogin;

        public LoginGoogleController(DataContext context, ISendDataLogin sendDataLogin)
        {
            _context = context;
            this.sendDataLogin = sendDataLogin;
        }

        [HttpPost("google-login-response-dto")]
        public async Task<LoginResponseDTO> GetLoginResponseDTOByEmailAndUserName([FromBody] EmailAndUsernameFromGoogleRequestDTO request)
        {
            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == 2);
            var user = await _context.Users
            .Include(u => u.UserDetail)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.Equals(request.Email));

            if (user == null)
            {
                // email dc chọn từ google sign-in chưa có trong database
                // các thuộc tính khác ngoài username và email trong LoginResponseDTO cho null hết

                UserDetails userDetails = new UserDetails();

                var newUser = new Users
                {

                    UserName = request.Username,
                    Password="",
                    Email = request.Email,
                    RoleId = defaultRole.RoleId,
                    Role = defaultRole, // Default role is "user"
                    Img = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
                    UserDetail = userDetails
                   
                };
                try
                {
                    await _context.AddAsync(userDetails);
                    await _context.AddAsync(newUser);
                    await _context.SaveChangesAsync();

                    await MyUtil.CreateDefault(_context, newUser);

                    var loginResponseDTOForNewEmail = await sendDataLogin.sendDataLogin(newUser);
                    return loginResponseDTOForNewEmail;
                    //return Ok(new MessageResponseDTO("Đăng ký tài khoản thành công ! Vui lòng xác minh tài khoản"));
                }
                catch (Exception ex)
                {
                    //return StatusCode(500, $"Đã xảy ra lỗi khi đăng ký người dùng: {ex.InnerException.Message}");
                    return null;
                }
            }
            var loginResponseDTO = await sendDataLogin.sendDataLogin(user);
            //var loginResponseDTO = new LoginResponseDTO()
            //{
            //};
            return loginResponseDTO;
        }
    }
}
