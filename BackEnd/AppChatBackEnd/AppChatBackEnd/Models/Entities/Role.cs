using AppChat.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace AppChatBackEnd.Models.Entities
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; } 
        public string RoleName { get; set; }
        public ICollection<Users> Users { get; set; }
    }
}
