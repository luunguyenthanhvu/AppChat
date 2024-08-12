using System.ComponentModel.DataAnnotations;

namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class UserListChatResponseDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Img { get; set; }
        public string? MessageContent { get; set; }
        public bool IsMine { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
