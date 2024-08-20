using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.Models.SecretKeyModel;
using AppChatBackEnd.Services.template;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AppChatBackEnd.Services.imp
{
    public class SendDataLoginImpl : ISendDataLogin
    {
        private AppSettings _appSettings;
        public SendDataLoginImpl(IOptionsMonitor<AppSettings> appSettings) { 
            _appSettings = appSettings.CurrentValue;
        }

      

        public async Task<LoginResponseDTO> sendDataLogin(Users users)
        {
            var jwtToken = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(_appSettings.SecretKey);
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {

                   new Claim(ClaimTypes.Email, users.Email),
                    new Claim("Role", users.Role.RoleName),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(24),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha256)




            };

            var token = jwtToken.CreateToken(tokenDescription);
            var accessToken = jwtToken.WriteToken(token);
            
                return new LoginResponseDTO
                {
                    Email = users.Email,
                    UserName = users.UserName,
                    Img = users.Img,
                    Role = users.Role.ToString(),
                    Token = accessToken

                };
            
           

        }
        public async Task<string> DecodeJwtToken(string token)
        {
            var jwtHandler = new JwtSecurityTokenHandler();

            if (jwtHandler.CanReadToken(token))
            {
                var jwtToken = jwtHandler.ReadJwtToken(token);

                // Lấy giá trị của claim Email và Role
                var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
                var role = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "Role")?.Value;

                // Tạo đối tượng ẩn danh và chuyển đổi nó thành chuỗi JSON
               String result = email;

                return result;
            }
            else
            {
                return "Token không hợp lệ";
            }
        }
       

    }
}
