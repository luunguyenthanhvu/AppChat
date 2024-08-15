using AppChatBackEnd.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppChat.Models.Entities
{
    public class Users
    {
        [Key]
        // auto increment
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        [EmailAddress]
        public string? Email { get; set; }

        public string Img { get; set; }
        public ICollection<Friend> Friends { get; set; }
        public ICollection<Message> MessagesSent { get; set; } 
        public ICollection<Message> MessagesReceived { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public UserDetails UserDetail { get; set; }
    }
}
