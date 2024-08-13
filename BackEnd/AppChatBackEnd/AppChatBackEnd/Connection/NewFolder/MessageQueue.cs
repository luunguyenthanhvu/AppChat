using AppChat.Models.Entities;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace AppChatBackEnd.Connection.NewFolder
{
    public class MessageQueue
    {
        private readonly ConcurrentDictionary<string, ConcurrentQueue<Message>> _userMessages = new ConcurrentDictionary<string, ConcurrentQueue<Message>>();

        public void EnqueueMessage(string userId, Message message)
        {
            var messages = _userMessages.GetOrAdd(userId, _ => new ConcurrentQueue<Message>());
            messages.Enqueue(message);
            PrintMessages(userId);
        }

        public IEnumerable<Message> GetMessages(string userSender, string userRecip)
        {
            var result = new List<Message>();
            if (_userMessages.TryGetValue(userSender, out var messagesSend))
            {
                foreach (var message in messagesSend)
                {
                    if (int.Parse(userSender) == message.Sender.UserId && int.Parse(userRecip) == message.Receiver.UserId)
                    {
                        result.Add(message);
                    }
                }
            }
            if (_userMessages.TryGetValue(userRecip, out var messagesRecipt))
            {
                foreach (var message in messagesRecipt)
                {
                    if (int.Parse(userSender) == message.Sender.UserId && int.Parse(userRecip) == message.Receiver.UserId)
                    {
                        result.Add(message);
                    }
                }
            }

            return result.OrderBy(m => m.Timestamp);
        }
        private void ClearTemporaryMessages(string userId)
        {
            _userMessages.TryRemove(userId, out _);
        }

        public void PrintMessages(string userId)
        {
            if (_userMessages.TryGetValue(userId, out var messages))
            {
                foreach (var message in messages)
                {
                    Console.WriteLine($"SenderId: {message.SenderId}, ReceiverId: {message.ReceiverId}, Content: {message.Content}, Timestamp: {message.Timestamp}");
                }
            }
            else
            {
                Console.WriteLine("No messages found for userId: " + userId);
            }
        }


    }
}
