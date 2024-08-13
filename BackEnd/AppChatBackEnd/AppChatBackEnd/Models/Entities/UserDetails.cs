using AppChat.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppChatBackEnd.Models.Entities
{
    public class UserDetails
    {
        [Key]
        public int UserDetailId { get; set; }
        public DateTime? Dob { get; set; }
        public int? Verified { get; set; }
        public DateTime? OtpExpiryTime { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Img { get; set; }
        public string? Otp { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public int? status { get; set; }
        public int? reportAmount { get; set; }
        // Foreign Key to User
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Users User { get; set; }
    }
}
