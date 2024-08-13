using AppChat.Data;
using AppChat.Models.Entities;
using AppChat.Models.Enums;
using AppChatBackEnd.DTO.Response.ChatResponse;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace AppChatBackEnd.Repositories.RepositoriesImpl
{
    public class ChatRepositoryImpl : IChatRepository
    {
        private readonly DataContext dbContext;

        public ChatRepositoryImpl(DataContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Users?> CreateDefault()
        {
            // Tạo người dùng gốc
            var mainUser = new Users
            {
                UserName = "vuluu",
                Password = "vuluu123",  // Lưu ý: Hash mật khẩu trong thực tế
                Email = "giaosukirito@gmail.com",
                Img = "https://res.cloudinary.com/dter3mlpl/image/upload/v1721587601/blvysg2v3ieh6mozjyfl.jpg"
            };

            // Danh sách để lưu các người dùng bạn bè
            var friendUsers = new List<Users>();

            // Tạo 5 người dùng bạn bè
            for (int i = 1; i <= 5; i++)
            {
                var friendUser = new Users
                {
                    UserName = $"kirito{i}",
                    Password = $"kirito{i}", // Lưu ý: Hash mật khẩu trong thực tế
                    Email = $"kirito{i}@gmail.com",
                    Img = "https://res.cloudinary.com/dter3mlpl/image/upload/v1723150672/ysucjn8tbgrnuqazff8n.jpg"
                };

                friendUsers.Add(friendUser);
            }

            // Thêm cả người dùng gốc và các người dùng bạn bè vào cơ sở dữ liệu
            await dbContext.Users.AddAsync(mainUser);
            await dbContext.Users.AddRangeAsync(friendUsers);
            await dbContext.SaveChangesAsync();

            // Cập nhật mối quan hệ bạn bè sau khi người dùng đã được lưu và có ID
            var friendRelations = friendUsers.Select(friendUser => new Friend
            {
                UserId = mainUser.UserId,
                FriendUserId = friendUser.UserId,
                Status = FriendStatus.Accepted // Thiết lập trạng thái bạn bè
            }).ToList();

            // Cập nhật mối quan hệ bạn bè ngược lại (người dùng bạn bè cũng phải có mối quan hệ bạn bè với người dùng gốc)
            var reverseFriendRelations = friendUsers.Select(friendUser => new Friend
            {
                UserId = friendUser.UserId,
                FriendUserId = mainUser.UserId,
                Status = FriendStatus.Accepted // Thiết lập trạng thái bạn bè
            }).ToList();

            // Thêm tất cả mối quan hệ bạn bè vào cơ sở dữ liệu
            await dbContext.Friends.AddRangeAsync(friendRelations.Concat(reverseFriendRelations));
            await dbContext.SaveChangesAsync();

            // Tạo tin nhắn giữa người dùng chính và bạn bè
            var messages = new List<Message>();
            foreach (var friendUser in friendUsers)
            {
                // Tạo một vài tin nhắn từ mainUser gửi đến bạn bè
                messages.Add(new Message
                {
                    SenderId = mainUser.UserId,
                    ReceiverId = friendUser.UserId,
                    Content = $"Hello {friendUser.UserName}, this is a message from {mainUser.UserName}.",
                    Timestamp = DateTime.UtcNow
                });

                // Tạo một vài tin nhắn từ bạn bè gửi đến mainUser
                messages.Add(new Message
                {
                    SenderId = friendUser.UserId,
                    ReceiverId = mainUser.UserId,
                    Content = $"Hi {mainUser.UserName}, this is a reply from {friendUser.UserName}.",
                    Timestamp = DateTime.UtcNow.AddMinutes(5) // Thời gian gửi sau tin nhắn trước 5 phút
                });
            }

            // Thêm tất cả các tin nhắn vào cơ sở dữ liệu
            await dbContext.Messages.AddRangeAsync(messages);
            await dbContext.SaveChangesAsync();

            return mainUser;
        }


        public async Task<Users?> GetUsersByEmail(string email)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.Email.Equals(email));
        }

        public async Task<List<UserListChatResponseDTO>> GetUsersListChatByEmail(string email)
        {
            // Lấy thông tin người dùng theo email
            var user = await dbContext.Users
                .Include(u => u.Friends) // Bao gồm thông tin bạn bè
                .ThenInclude(f => f.FriendUser) // Bao gồm thông tin người bạn
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || user.Friends == null)
            {
                return new List<UserListChatResponseDTO>();
            }

            var userFriends = user.Friends
                .Select(f => f.FriendUser)
                .Where(f => f != null) // Loại bỏ các bạn bè null
                .ToList();

            if (!userFriends.Any())
            {
                return new List<UserListChatResponseDTO>();
            }

            // Lấy tất cả tin nhắn gửi từ các bạn bè của người dùng
            var friendUserIds = userFriends.Select(u => u.UserId).ToList();

            var messages = await (from m in dbContext.Messages
                                  where friendUserIds.Contains(m.SenderId)
                                  select new
                                  {
                                      m.Content,
                                      m.SenderId,
                                      m.ReceiverId,
                                      m.Timestamp
                                  }).ToListAsync();

            // Xác định ID của người dùng hiện tại
            var currentUserId = user.UserId;

            // Tạo danh sách kết quả với tin nhắn cuối cùng cho mỗi bạn bè
            var chatList = userFriends.Select(friend => new UserListChatResponseDTO
            {
                UserId = friend.UserId,
                UserName = friend.UserName,
                Img = friend.Img,
                // Lấy tin nhắn cuối cùng của người dùng này
                MessageContent = messages.Where(m => m.SenderId == friend.UserId && m.ReceiverId == currentUserId)
                                         .OrderByDescending(m => m.Timestamp)
                                         .Select(m => m.Content)
                                         .FirstOrDefault() ?? string.Empty,
                // Xác định xem người gửi có phải là người dùng hiện tại không
                IsMine = messages.Where(m => m.SenderId == friend.UserId && m.ReceiverId == currentUserId)
                                 .OrderByDescending(m => m.Timestamp)
                                 .Select(m => m.SenderId)
                                 .FirstOrDefault() == currentUserId,
                Timestamp = DateTime.Now // Timestamp hiện tại nếu không có tin nhắn
            }).ToList();

            return chatList;
        }

        public async Task SaveMessagesToDatabase(IEnumerable<Message> messages)
        {
            dbContext.Messages.AddRange(messages);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<ListMessageResponseDTO>> GetUserMessage(int userId, int userChattingId)
        {
            // Lấy ra danh sách tin nhắn giữa hai người dùng dựa trên ID của họ
            var messages = await dbContext.Messages
                .Where(m => (m.SenderId == userId && m.ReceiverId == userChattingId) ||
                            (m.SenderId == userChattingId && m.ReceiverId == userId))
                .OrderBy(m => m.Timestamp) // Sắp xếp theo thời gian gửi
                .ToListAsync();

            // Chuyển đổi danh sách tin nhắn sang DTO
            var messageDtos = messages.Select(m => new ListMessageResponseDTO
            {   
               SenderId = m.SenderId,
               Content = m.Content,
               ReceiverId = m.ReceiverId,
               Timestamp = m.Timestamp
            }).ToList();

            return messageDtos;
        }
    }
}
