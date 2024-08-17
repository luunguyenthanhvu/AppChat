namespace AppChatBackEnd.DTO.Request
{
    public class ChangePasswordRequestDTO
    {
       public int IdUser { get; set; }
        public string Password { get; set; }    
        public string NewPassword { get; set; }
        public string ReTypePassword { get; set; }
    }
}
