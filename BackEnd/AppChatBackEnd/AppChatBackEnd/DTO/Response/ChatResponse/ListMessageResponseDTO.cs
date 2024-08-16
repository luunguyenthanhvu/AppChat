namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class ListMessageResponseDTO
    {
        public Guid MessageId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public bool IsImage { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
