namespace AppChatBackEnd.DTO.Request
{
    public class UpdateUserDetailsRequestDTO
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Dob { get; set; }
    }
}
