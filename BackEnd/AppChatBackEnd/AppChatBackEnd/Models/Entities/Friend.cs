using AppChat.Models.Enums;

namespace AppChat.Models.Entities
{
    public class Friend
    {
        public int FriendId { get; set; }
        public int UserId { get; set; }
        public int FriendUserId { get; set; }
        public FriendStatus Status { get; set; } // Use the FriendStatus enum type

        public Users User { get; set; }
        public Users FriendUser { get; set; }
    }
}
