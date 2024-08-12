namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class ListMessageResponseDTO
    {
        public int MessageId { get; set; }
        public string? MessageContent { get; set; }
        public bool IsMine { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
