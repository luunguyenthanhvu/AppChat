using AppChat.Models.Entities;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace AppChatBackEnd.Connection.WebSocketConnection
{
    public class UserSessionManager
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _userConnections = new();

        public void AddConnection (string id, string connectionId)
        {
            var connections = _userConnections.GetOrAdd(id, _ => new HashSet<string>());
            lock (connections)
            {
                connections.Add(connectionId);
            }
        }

        public void RemoveConnection(string id, string connectionId)
        {
            if(_userConnections.TryGetValue(id, out var connections)) {
                lock(connections)
                {
                    connections.Remove(connectionId);
                    if(connections.Count == 0)
                    {
                        _userConnections.TryRemove(id, out _);
                    }

                }
            }
        }

        public IEnumerable<string> GetConnections(string userId)
        {
            return _userConnections.TryGetValue(userId, out var connections) ? connections : Enumerable.Empty<string>();
        }
    }
}
