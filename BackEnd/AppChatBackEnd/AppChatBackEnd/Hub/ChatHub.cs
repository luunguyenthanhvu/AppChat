﻿using AppChat.Models.Entities;
using AppChatBackEnd.Connection.NewFolder;
using AppChatBackEnd.Connection.WebSocketConnection;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.IO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace AppChatBackEnd.ChatHub
{
    public class ChatHub : Hub
    {
        private readonly UserSessionManager _userSessionManager;
        private readonly MessageQueue _messageQueue;
        private readonly IChatRepository _chatRepository;

        public ChatHub(UserSessionManager userSessionManager, MessageQueue messageQueue, IChatRepository chatRepository)
        {
            _userSessionManager = userSessionManager;
            _messageQueue = messageQueue;
            _chatRepository = chatRepository;
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

        public async Task SendMessage(string recipientUserId, string message)
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
                SenderId = int.Parse(senderUserId),
                ReceiverId = int.Parse(recipientUserId),
                Content = message,
                Timestamp = DateTime.Now
            };

            var messageSave = new Message
            {
                SenderId = int.Parse(senderUserId),
                ReceiverId = int.Parse(recipientUserId),
                Content = message,
                Timestamp = DateTime.Now
            };
            Console.WriteLine(messageSave);
            await _chatRepository.SaveMessagesToDatabase(messageSave);
            _messageQueue.EnqueueMessage(recipientUserId, messageSave);

            // Gửi tin nhắn đến tất cả các kết nối của người nhận
            foreach (var connectionId in connectionsRecipents)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageResponse);
            }

            // Gửi tin nhắn đến tất cả các kết nối của người gửi
            foreach (var connectionId in connectionsSenders)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageResponse);
            }
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", messageResponse);
        }
    }
}
