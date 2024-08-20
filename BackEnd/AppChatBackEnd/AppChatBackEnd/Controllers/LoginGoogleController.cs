using AppChat.Data;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginGoogleController : ControllerBase
    {
        private readonly DataContext _context;
        //private readonly IMapper _mapper;

        public LoginGoogleController(DataContext context, IMapper mapper)
        {
            _context = context;
            //_mapper = mapper;
        }

        [HttpPost("decodeJWT")]
        public IActionResult DecodeJwt([FromBody] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required");
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // Trích xuất email từ claims
                var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "email");
                if (emailClaim != null)
                {
                    return Ok(new { email = emailClaim.Value });
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

        //[HttpPost("google-login")]
        //public async Task<IActionResult> Get(string email)
        //{

        //}
    }
}
