using AppChat.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AppChatBackEnd.Models.Entities
{
    public class Reports
    {
        [Key]
        public int ReportId { get; set; }

        [Required]
        public int ReportedUserId { get; set; }

        [Required]
        public int ReportingUserId { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Timestamp { get; set; }

        // Quan hệ với User
        [ForeignKey("ReportedUserId")]
        public Users ReportedUser { get; set; }

        [ForeignKey("ReportingUserId")]
        public Users ReportingUser { get; set; }
    }

}
