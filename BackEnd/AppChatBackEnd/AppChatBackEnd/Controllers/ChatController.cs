
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request.ChatRequest;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AppChatBackEnd.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IChatRepository chatRepository;


        public ChatController(IMapper mapper, IChatRepository chatRepository)
        {
            this.mapper = mapper;
            this.chatRepository = chatRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var data = await chatRepository.GetUsersByEmail(loginRequestDTO.Email);

            if (data == null && loginRequestDTO.Email == "giaosukirito@gmail.com")
            {
                data = await chatRepository.CreateDefault();
            }
            if (data == null)
            {
                return Unauthorized();
            }
            var token = GenerateFakeToken(data);

            var response = new LoginResponseDTO
            {
                UserName = data.UserName,
                Email = data.Email,
                Img = data.Img,
                Token = token
            };

            return Ok(response);
        }

        [HttpGet("user-chat-list")]
        public async Task<IActionResult> GetListChat([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            var response = await chatRepository.GetUsersListChatByEmail(email);

            return Ok(response);
        }

        [HttpGet("messages/{email}/{userChattingId}")]
        public async Task<IActionResult> GetUserMessages(string email, int userChattingId)
        {
            var data = await chatRepository.GetUsersByEmail(email);
            var oldMessages = await chatRepository.GetUserMessage(data.UserId, userChattingId);
            return Ok(oldMessages);
        }

        private string GenerateFakeToken(Users user)
        {
            var token = $"FakeToken_{user.UserId}_{user.Email}";
            return token;
        }
    }
}
