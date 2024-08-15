
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.NewFolder;
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

        public ChatController (IMapper mapper, IChatRepository chatRepository)
        {
            this.mapper = mapper;
            this.chatRepository = chatRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginResponseDTO loginRequestDTO)
        {
            var data = await chatRepository.GetUsersByEmail(loginRequestDTO.Email);

            if (data == null && loginRequestDTO.Email == "giaosukirito@gmail.com")
            {
                data = await chatRepository.CreateDefault();
            }
            return Ok(mapper.Map<LoginResponseDTO>(data));
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
            var messages = await chatRepository.GetUserMessage(data.UserId, userChattingId);
            return Ok(messages);
        }

    }
}
