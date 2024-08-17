namespace AppChat.DTO.Request
{
    public class CreateUserRequestDTO
    {
        public String UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Img { get; set; }
        public int RoleId { get; set; }
    }
}
