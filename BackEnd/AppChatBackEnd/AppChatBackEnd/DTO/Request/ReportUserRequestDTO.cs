namespace AppChat.DTO.Request
{
    public class ReportUserRequestDTO
    {
        public int ReportedUserId { get; set; }
        public int ReportingUserId { get; set; }
        public string Reason { get; set; }
        //public DateTime Timestamp { get; set; }
    }
}
