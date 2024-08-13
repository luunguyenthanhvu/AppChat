using AppChat.Models.Entities;
using AppChatBackEnd.Connection.NewFolder;
using AppChatBackEnd.DTO.Request.NewFolder;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.NewFolder;
using AppChatBackEnd.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace AppChatBackEnd.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IChatRepository chatRepository;
        private readonly MessageQueue _messageQueue;

        public ChatController (IMapper mapper, IChatRepository chatRepository, MessageQueue messageQueue)
        {
            this.mapper = mapper;
            this.chatRepository = chatRepository;
            _messageQueue = messageQueue;
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
            /*
             *
             *var tempMessages = _messageQueue.GetMessages(data.UserId + "", userChattingId + "");
            _messageQueue.PrintMessages(data.UserId+"");
            var messageDtos = tempMessages.Select(m => new ListMessageResponseDTO
            {
                SenderId = m.SenderId,
                Content = m.Content,
                ReceiverId = m.ReceiverId,
                Timestamp = m.Timestamp
            }).ToList();

            var allMessages = oldMessages.Concat(messageDtos)
                                  .OrderBy(m => m.Timestamp)
                                  .ToList();
            */
            return Ok(oldMessages);
        }

        private string GenerateFakeToken(Users user)
        {
            var token = $"FakeToken_{user.UserId}_{user.Email}";

            return token;
        }
    }
}
