using AppChatBackEnd.Connection.WebSocketConnection;
using AppChatBackEnd.DTO.Response.ChatResponse;
using Microsoft.AspNetCore.SignalR;

namespace AppChatBackEnd.ChatHub
{
    public class ChatHub : Hub
    {
        private readonly UserSessionManager _userSessionManager;

        public ChatHub(UserSessionManager userSessionManager)
        {
            _userSessionManager = userSessionManager;
        }

        public override async Task OnConnectedAsync()
        {
            var login = "login long cac";
            Console.WriteLine(login);
            var token = Context.GetHttpContext()?.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(token))
            {
                var tokenValue = token;
                var parts = tokenValue.Split('_');

                if (parts.Length == 3)
                {
                    var userId = parts[1];
                    var email = parts[2];

                    Context.Items["UserId"] = userId;
                    _userSessionManager.AddConnection(userId, Context.ConnectionId);

                    // Logging
                    System.Diagnostics.Debug.WriteLine($"User connected: {userId}, Connection ID: {Context.ConnectionId}");
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var token = Context.GetHttpContext()?.Request.Headers["Authorization"].FirstOrDefault();

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
            var senderUserId = Context.Items["UserId"]?.ToString();
            var login = "djtme long cac";
            Console.WriteLine(login);

            if (string.IsNullOrEmpty(senderUserId))
            {
                System.Diagnostics.Debug.WriteLine("Sender UserId is null or empty.");
                return;
            }

            System.Diagnostics.Debug.WriteLine($"Sender UserId: {senderUserId}");

            var connections = _userSessionManager.GetConnections(recipientUserId);

            if (connections == null || !connections.Any())
            {
                System.Diagnostics.Debug.WriteLine($"No connections found for recipient: {recipientUserId}");
                return;
            }

            var messageResponse = new ListMessageResponseDTO
            {
                MessageContent = message,
                IsMine = true,
                Timestamp = DateTime.UtcNow
            };

            foreach (var connectionId in connections)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageResponse);
            }

            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", messageResponse);
        }

    }
}
