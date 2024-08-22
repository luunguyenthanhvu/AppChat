using AppChat.Models.Entities;
using AppChatBackEnd.Connection.WebSocketConnection;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Repositories;
using AppChatBackEnd.utils;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.IO;
using System.Runtime.Intrinsics.X86;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AppChatBackEnd.ChatHub
{
    public class ChatHub : Hub
    {
        private readonly UserSessionManager _userSessionManager;
        private readonly IChatRepository _chatRepository;
        private readonly IVuLuuMarkUpRepository _remarkRepository;
        private string _lastMessageSent = string.Empty;
        public ChatHub(UserSessionManager userSessionManager, IChatRepository chatRepository, IVuLuuMarkUpRepository remarkRepository)
        {
            _userSessionManager = userSessionManager;
            _chatRepository = chatRepository;
            _remarkRepository = remarkRepository;
        }

        public override async Task OnConnectedAsync()
        {
          
            // Lấy token từ query string
            var token = Context.GetHttpContext()?.Request.Query["access_token"].FirstOrDefault();
            var email = MyUtil.DecodeJwtTokenToEmail(token);
            var user = await _chatRepository.GetUsersByEmail(email);
            Context.Items["UserId"] = user.UserId;
            Context.Items["UserEmail"] = email;
            _userSessionManager.AddConnection(user.UserId + "", Context.ConnectionId);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Lấy token từ query string
            var token = Context.GetHttpContext()?.Request.Query["access_token"].FirstOrDefault();

            var email = MyUtil.DecodeJwtTokenToEmail(token);
            var user = await _chatRepository.GetUsersByEmail(email);
            _userSessionManager.RemoveConnection(user.UserId +"", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string recipientUserId, string message,bool isImage)
        { 
            var senderUserId = Context.Items["UserId"] +"";
            var connectionsRecipents = _userSessionManager.GetConnections(recipientUserId);
            var connectionsSenders = _userSessionManager.GetConnections(senderUserId);

            if (connectionsSenders == null || !connectionsSenders.Any())
            {
                System.Diagnostics.Debug.WriteLine($"No connections found for recipient: {recipientUserId}");
                return;
            }

            var messageResponse = new ListMessageResponseDTO
            {
                MessageId = Guid.NewGuid(),
                SenderId = int.Parse(senderUserId),
                ReceiverId = int.Parse(recipientUserId),
                Content = message,
                Timestamp = DateTime.Now,
                IsImage = isImage
            };

            var messageSave = new Message
            {
                SenderId = int.Parse(senderUserId),
                ReceiverId = int.Parse(recipientUserId),
                Content = message,
                Timestamp = DateTime.Now,
                isImage = isImage
            };

            await _chatRepository.SaveMessagesToDatabase(messageSave);
            var listChatUserReceive = await _chatRepository.GetUsersListChatById(int.Parse(recipientUserId));
            var listChatUserSender = await _chatRepository.GetUsersListChatById(int.Parse(senderUserId));
            // Gửi tin nhắn đến tất cả các kết nối của người nhận
            foreach (var connectionId in connectionsRecipents)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageResponse);
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserReceive);
            }

            // Gửi tin nhắn đến tất cả các kết nối của người gửi
            foreach (var connectionId in connectionsSenders)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageResponse);
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserSender);

            }
           // await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", messageResponse);
        }
        public async Task UpdateProfile(string email, bool isUpdateImage, bool isUpdatePass)
        {
            var userEmail = Context.Items["UserEmail"] + "";
            var user = await _chatRepository.GetUsersByEmail(email);
            var response = new LoginResponseDTO
            {
                UserName = user.UserName,
                Email = user.Email,
                Img = user.Img
            };
            var connectionsConnect = _userSessionManager.GetConnections(user.UserId + "");
            foreach (var connectionId in connectionsConnect)
            {
                await Clients.Client(connectionId).SendAsync("UserInfoUpdate", response);
            }
        }
        public async Task UpdatePassword(string email)
        {
            var user = await _chatRepository.GetUsersByEmail(email);
            var connectionsConnect = _userSessionManager.GetConnections(user.UserId + "");
            foreach (var connectionId in connectionsConnect)
            {
                await Clients.Client(connectionId).SendAsync("UpdatePasswordAccount", "password changed");
            }
        }

        public async Task UpdateChat(string user1Email, string user2Email)
        {
            var user1 = await _chatRepository.GetUsersByEmail(user1Email);
            var user2 = await _chatRepository.GetUsersByEmail(user2Email);
            var listChatUserReceive = await _chatRepository.GetUsersListChatById(user1.UserId);
            var listChatUserSender = await _chatRepository.GetUsersListChatById(user2.UserId);

            var connectionsRecipents = _userSessionManager.GetConnections(user1.UserId + "");
            var connectionsSenders = _userSessionManager.GetConnections(user2.UserId + "");
            // Gửi tin nhắn đến tất cả các kết nối của người nhận
            foreach (var connectionId in connectionsRecipents)
            {
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserReceive);
            }

            // Gửi tin nhắn đến tất cả các kết nối của người gửi
            foreach (var connectionId in connectionsSenders)
            {
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserSender);

            }
        }

        public async Task UpdateChatWithId(string user1Email, int user2Id)
        {
            var user1 = await _chatRepository.GetUsersByEmail(user1Email);
            var user2 = await _chatRepository.GetUsersById(user2Id);
            var listChatUserReceive = await _chatRepository.GetUsersListChatById(user1.UserId);
            var listChatUserSender = await _chatRepository.GetUsersListChatById(user2.UserId);

            var connectionsRecipents = _userSessionManager.GetConnections(user1.UserId + "");
            var connectionsSenders = _userSessionManager.GetConnections(user2.UserId + "");
            // Gửi tin nhắn đến tất cả các kết nối của người nhận
            foreach (var connectionId in connectionsRecipents)
            {
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserReceive);
            }

            // Gửi tin nhắn đến tất cả các kết nối của người gửi
            foreach (var connectionId in connectionsSenders)
            {
                await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserSender);

            }
        }

        public async Task SendNotification(string message)
        {
            // Kiểm tra nếu tin nhắn mới giống với tin nhắn cuối cùng đã gửi
            if (_lastMessageSent == message)
            {
                Console.WriteLine("Duplicate message detected. The message has already been sent.");
                return; // Ngừng việc gửi tin nhắn trùng lặp
            }

            // Cập nhật biến _lastMessageSent với tin nhắn mới
            _lastMessageSent = message;

            // Lấy người dùng admin
            var adminUser = await _chatRepository.GetUsersByEmail("0982407940ab@gmail.com");

            Console.WriteLine(message);
            // Lấy danh sách người dùng kết bạn với admin
            var friends = await _chatRepository.GetFriendsByUserId(adminUser.UserId);

            foreach (var friend in friends)
            {
                var friendUser = await _chatRepository.GetUserById(friend.UserId);

                if (friendUser != null)
                {
                    var messageSave = new Message
                    {
                        SenderId = adminUser.UserId,
                        ReceiverId = friend.UserId,
                        Content = "THIS IS ADMIN NOTIFICATION\n" + message,
                        Timestamp = DateTime.Now,
                        isImage = false // Assuming message is not an image
                    };

                    await _chatRepository.SaveMessagesToDatabase(messageSave);
                    var listChatUserReceive = await _chatRepository.GetUsersListChatById(friend.UserId);
                    var connections = _userSessionManager.GetConnections(friend.UserId + "");
                    foreach (var connectionId in connections)
                    {
                        await Clients.Client(connectionId).SendAsync("NewListChatReceive", listChatUserReceive);
                    }
                }
            }
        }
    }
}
