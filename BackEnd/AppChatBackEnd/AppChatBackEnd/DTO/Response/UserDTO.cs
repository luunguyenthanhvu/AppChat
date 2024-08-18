namespace AppChatBackEnd.DTO.Response
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Img { get; set; }

        // New properties added
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string RoleName { get; set; } // Assuming you want to display the role name
    }
}