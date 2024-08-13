namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class ListMessageResponseDTO
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
