using AppChat.Data;
using AppChatBackEnd.Repositories.RepositoriesImpl;
using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;

namespace AppChat.Repositories.RepositoriesImpl
{
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;

        public NotificationService(DataContext context)
        {
            _context = context;
        }

        public async Task SendPushNotificationToAllUsers(string title, string message)
        {
            // Lấy danh sách người dùng
            var users = await _context.Users.ToListAsync();

            // Gửi thông báo đến tất cả người dùng
            users.ForEach(async user =>
            {
                if (!string.IsNullOrEmpty(user.FcmToken))
                {
                    var notificationMessage = new Message()
                    {
                        Token = user.FcmToken,
                        Notification = new Notification
                        {
                            Title = title,
                            Body = message
                        }
                    };

                    // Gửi thông báo
                    await FirebaseMessaging.DefaultInstance.SendAsync(notificationMessage);
                }
            });
        }
    }

}
