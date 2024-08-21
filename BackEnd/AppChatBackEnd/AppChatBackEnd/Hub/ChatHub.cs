using AppChat.Models.Entities;
using AppChatBackEnd.Connection.WebSocketConnection;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Repositories;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.IO;
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
        public ChatHub(UserSessionManager userSessionManager, IChatRepository chatRepository, IVuLuuMarkUpRepository remarkRepository)
        {
            _userSessionManager = userSessionManager;
            _chatRepository = chatRepository;
            _remarkRepository = remarkRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var login = "logout long cac";
            Console.WriteLine(login);
            
            // Lấy token từ query string
            var token = Context.GetHttpContext()?.Request.Query["access_token"].FirstOrDefault();
            Console.WriteLine($"{token} token ne"); // In token ra để kiểm tra

            if (!string.IsNullOrEmpty(token))
            {
                var tokenValue = token;
                var parts = tokenValue.Split('_');
                Console.WriteLine(parts);
                if (parts.Length == 3)
                {
                    var userId = parts[1];
                    var email = parts[2];

                    Context.Items["UserId"] = userId;
                    Context.Items["UserEmail"] = email;
                    login = " long cac connection" + Context.ConnectionId;
                    Console.WriteLine(login);
                    _userSessionManager.AddConnection(userId, Context.ConnectionId);

                    // Logging
                    System.Diagnostics.Debug.WriteLine($"User connected: {userId}, Connection ID: {Context.ConnectionId}");
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Lấy token từ query string
            var token = Context.GetHttpContext()?.Request.Query["access_token"].FirstOrDefault();
            Console.WriteLine($"{token} token ne"); // In token ra để kiểm tra


            if (!string.IsNullOrEmpty(token))
            {
                var tokenValue = token;
                var parts = tokenValue.Split('_');

                if (parts.Length == 3)
                {
                    var userId = parts[1];
            

                    _userSessionManager.RemoveConnection(userId, Context.ConnectionId);

                    // Logging
                    System.Diagnostics.Debug.WriteLine($"User disconnected: {userId}, Connection ID: {Context.ConnectionId}");
                }
            }

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
    }
}
