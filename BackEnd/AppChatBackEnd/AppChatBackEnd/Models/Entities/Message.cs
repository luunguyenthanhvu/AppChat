using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppChat.Models.Entities
{
    public class Message
    {
        [Key]
        // auto increment
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; } 
        public string Content { get; set; }
        public bool isImage {  get; set; }
        public DateTime Timestamp { get; set; }

        public Users Sender { get; set; }
        public Users Receiver { get; set; } 
    }
}
