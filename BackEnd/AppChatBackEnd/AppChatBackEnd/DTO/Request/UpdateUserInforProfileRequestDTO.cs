namespace AppChat.DTO.Request
{
    public class UpdateUserInforProfileRequestDTO
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
