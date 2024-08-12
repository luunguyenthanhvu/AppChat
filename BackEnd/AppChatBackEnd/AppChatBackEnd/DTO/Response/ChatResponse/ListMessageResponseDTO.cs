namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class ListMessageResponseDTO
    {
        public string? MessageContent { get; set; }
        public bool IsMine { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
