using AppChat.Data;
using AppChat.DTO.Response;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.Models.Entities;
using AppChatBackEnd.Models.SecretKeyModel;
using AppChatBackEnd.Services.template;
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

        [HttpPost("decode-token-google")]
        public async Task<IActionResult> DecodeTokenGoogle([FromBody] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required");
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // Trích xuất email và username từ claims
                var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "email");
                var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "name");

                if (emailClaim != null && usernameClaim != null)
                {
                    return Ok(new { email = emailClaim.Value, username = usernameClaim.Value });
                }
                else if (emailClaim != null)
                {
                    return Ok(new { email = emailClaim.Value, username = "Username not found" });
                }
                else
                {
                    return BadRequest("Email not found in token");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to decode JWT: {ex.Message}");
            }
        }


        [HttpPost("google-login-response-dto")]
        public async Task<LoginResponseDTO> GetLoginResponseDTOByEmailAndUserName([FromBody] EmailAndUsernameFromGoogleRequestDTO request)
        {
            var user = await _context.Users
            .Include(u => u.UserDetail)
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
                    RoleId = 2, // Default role is "user"
                    Img = "",
                    UserDetail = userDetails
                };
                try
                {
                    await _context.UserDetails.AddAsync(userDetails);
                    await _context.Users.AddAsync(newUser);
                    await _context.SaveChangesAsync();

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
            return loginResponseDTO;
        }
    }
}
