namespace AppChatBackEnd.DTO.Request
{
    public class PushNotificationRequestDTO
    {
        public string Title { get; set; } // Tiêu đề của thông báo (tùy chọn)
        public string Message { get; set; } // Nội dung của thông báo
    }
}
