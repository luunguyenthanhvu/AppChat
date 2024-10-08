﻿using AppChat.Data;
using AppChat.Models.Entities;
using AppChat.Models.Enums;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Models.Entities;
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
            // Ensure the default role exists in the database
            var defaultRole = await dbContext.Roles.FirstOrDefaultAsync(r => r.RoleId == 1);
            if (defaultRole == null)
            {
                throw new InvalidOperationException("Default role does not exist.");
            }

            // Create the main user
            var mainUser = new Users
            {
                UserName = "vuluu",
                Password = "vuluu123",  // Note: Hash the password in real scenarios
                Email = "giaosukirito@gmail.com",
                Img = "https://res.cloudinary.com/dter3mlpl/image/upload/v1721587601/blvysg2v3ieh6mozjyfl.jpg",
                RoleId = defaultRole.RoleId // Set the role for the main user
            };

            var mainUserDetail = new UserDetails
            {
                FirstName = "Vu",
                LastName = "Luu",
                Dob = new DateTime(1990, 1, 1),
                PhoneNumber = "123456789",
                Gender = "Male",
                Status = "Active",
                User = mainUser // Link the UserDetails to the main user
            };

            // Add the main user and their details to the database
            await dbContext.Users.AddAsync(mainUser);
            await dbContext.UserDetails.AddAsync(mainUserDetail);

            // List to hold friend users and their details
            var friendUsers = new List<Users>();
            var friendUserDetails = new List<UserDetails>();

            // Create 5 friend users and their details
            for (int i = 1; i <= 5; i++)
            {
                var friendUser = new Users
                {
                    UserName = $"kirito{i}",
                    Password = $"kirito{i}", // Note: Hash the password in real scenarios
                    Email = $"kirito{i}@gmail.com",
                    Img = "https://res.cloudinary.com/dter3mlpl/image/upload/v1723150672/ysucjn8tbgrnuqazff8n.jpg",
                    RoleId = defaultRole.RoleId // Set the role for each friend user
                };

                var friendUserDetail = new UserDetails
                {
                    FirstName = $"FirstName_{i}",
                    LastName = $"LastName_{i}",
                    Dob = new DateTime(1995, 1, 1).AddYears(i),
                    PhoneNumber = $"123456789{i}",
                    Gender = "Male",
                    Status = "Active",
                    User = friendUser // Link the UserDetails to the friend user
                };

                friendUsers.Add(friendUser);
                friendUserDetails.Add(friendUserDetail);
            }

            // Add the friend users and their details to the database
            await dbContext.Users.AddRangeAsync(friendUsers);
            await dbContext.UserDetails.AddRangeAsync(friendUserDetails);

            await dbContext.SaveChangesAsync();

            // Add UserDetails for the main user
            var mainUserDetails = new UserDetails
            {
                UserId = mainUser.UserId,
                FirstName = "Vuluu",
                LastName = "User",
                Dob = new DateTime(2000, 1, 1),  // Example date
                PhoneNumber = "1234567890",
                Gender = "Male"
            };
            await dbContext.UserDetails.AddAsync(mainUserDetails);

            // Add UserDetails for friend users
            foreach (var friendUser in friendUsers)
            {
                var friendUserDetails2 = new UserDetails
                {
                    UserId = friendUser.UserId,
                    FirstName = friendUser.UserName,
                    LastName = "Friend",
                    Dob = new DateTime(2000, 1, 1),  // Example date
                    PhoneNumber = "0987654321",
                    Gender = "Female"
                };
                await dbContext.UserDetails.AddAsync(friendUserDetails2);
            }

            await dbContext.SaveChangesAsync();

            // Update friend relationships after users are saved and have IDs
            var friendRelations = friendUsers.Select(friendUser => new Friend
            {
                UserId = mainUser.UserId,
                FriendUserId = friendUser.UserId,
                Status = FriendStatus.Accepted
            }).ToList();

            var reverseFriendRelations = friendUsers.Select(friendUser => new Friend
            {
                UserId = friendUser.UserId,
                FriendUserId = mainUser.UserId,
                Status = FriendStatus.Accepted
            }).ToList();

            await dbContext.Friends.AddRangeAsync(friendRelations.Concat(reverseFriendRelations));
            await dbContext.SaveChangesAsync();

            // Create messages between the main user and friends
            var messages = new List<Message>();
            foreach (var friendUser in friendUsers)
            {
                messages.Add(new Message
                {
                    SenderId = mainUser.UserId,
                    ReceiverId = friendUser.UserId,
                    Content = $"Hello {friendUser.UserName}, this is a message from {mainUser.UserName}.",
                    Timestamp = DateTime.UtcNow,
                    isImage = false
                });

                messages.Add(new Message
                {
                    SenderId = friendUser.UserId,
                    ReceiverId = mainUser.UserId,
                    Content = $"Hi {mainUser.UserName}, this is a reply from {friendUser.UserName}.",
                    Timestamp = DateTime.UtcNow.AddMinutes(5),
                    isImage = false
                });
            }

            await dbContext.Messages.AddRangeAsync(messages);
            await dbContext.SaveChangesAsync();

            return mainUser;
        }



        public async Task<Users?> GetUsersByEmail(string email)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.Email.Equals(email));
        }
        public async Task<Users> GetUsersById(int id)
        {
            return await dbContext.Users
                                   .FirstOrDefaultAsync(x => x.UserId == id);
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
                .Where(f => f.Status == FriendStatus.Accepted)
                .Select(f => f.FriendUser)
                .Where(f => f != null) // Loại bỏ các bạn bè null
                .ToList();

            if (!userFriends.Any())
            {
                return new List<UserListChatResponseDTO>();
            }

            // Lấy tất cả tin nhắn liên quan đến người dùng hiện tại và bạn bè
            var friendUserIds = userFriends.Select(u => u.UserId).ToList();
            var currentUserId = user.UserId;

            var messages = await (from m in dbContext.Messages
                                  where (friendUserIds.Contains(m.SenderId) && m.ReceiverId == currentUserId)
                                     || (friendUserIds.Contains(m.ReceiverId) && m.SenderId == currentUserId)
                                  select new
                                  {
                                      m.Content,
                                      m.SenderId,
                                      m.ReceiverId,
                                      m.Timestamp,
                                      m.isImage
                                  }).ToListAsync();

            // Tạo danh sách kết quả với tin nhắn cuối cùng cho mỗi bạn bè
            var chatList = userFriends.Select(friend =>
            {
                // Lấy tin nhắn cuối cùng giữa người dùng và bạn
                var lastMessage = messages.Where(m =>
                                         (m.SenderId == friend.UserId && m.ReceiverId == currentUserId)
                                      || (m.SenderId == currentUserId && m.ReceiverId == friend.UserId))
                                          .OrderByDescending(m => m.Timestamp)
                                          .FirstOrDefault();

                var isMine = lastMessage?.SenderId == currentUserId;
                var isImg = lastMessage.isImage;
                var messageContent = "";
                if (isImg)
                {
                    messageContent = isMine ? $"You: Image.png" : "Image.png" ?? string.Empty;
                }
                else
                {
                    messageContent = isMine ? $"You: {lastMessage?.Content}" : lastMessage?.Content ?? string.Empty;
                }

                return new UserListChatResponseDTO
                {
                    UserId = friend.UserId,
                    UserName = friend.UserName,
                    Img = friend.Img,
                    MessageContent = messageContent,
                    IsMine = isMine,
                    Timestamp = lastMessage?.Timestamp ?? DateTime.Now,
                    IsImage = lastMessage.isImage
                };
            })
                .OrderByDescending(chat => chat.Timestamp)
                .ToList();

            return chatList;
        }
        public async Task<List<UserListChatResponseDTO>> GetUsersFriendListChatByEmailAndUserName(string email, string username)
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
                        .Where(f => f.Status == FriendStatus.Accepted)
                .Select(f => f.FriendUser)
                 .Where(f =>
                    f.UserName != null &&
                    (string.IsNullOrEmpty(username) || f.UserName.Contains(username)))
                 .ToList();

            if (!userFriends.Any())
            {
                return new List<UserListChatResponseDTO>();
            }

            // Lấy tất cả tin nhắn liên quan đến người dùng hiện tại và bạn bè
            var friendUserIds = userFriends.Select(u => u.UserId).ToList();
            var currentUserId = user.UserId;

            var messages = await (from m in dbContext.Messages
                                  where (friendUserIds.Contains(m.SenderId) && m.ReceiverId == currentUserId)
                                     || (friendUserIds.Contains(m.ReceiverId) && m.SenderId == currentUserId)
                                  select new
                                  {
                                      m.Content,
                                      m.SenderId,
                                      m.ReceiverId,
                                      m.Timestamp,
                                      m.isImage
                                  }).ToListAsync();

            // Tạo danh sách kết quả với tin nhắn cuối cùng cho mỗi bạn bè
            var chatList = userFriends.Select(friend =>
            {
                // Lấy tin nhắn cuối cùng giữa người dùng và bạn
                var lastMessage = messages.Where(m =>
                                         (m.SenderId == friend.UserId && m.ReceiverId == currentUserId)
                                      || (m.SenderId == currentUserId && m.ReceiverId == friend.UserId))
                                          .OrderByDescending(m => m.Timestamp)
                                          .FirstOrDefault();

                var isMine = lastMessage?.SenderId == currentUserId;
                var isImg = false;
                if(lastMessage.isImage != null)
                {
                    isImg = lastMessage.isImage;
                }
                var messageContent = "";
                if (isImg)
                {
                    messageContent = isMine ? $"You: Image.png" : "Image.png" ?? string.Empty;
                }
                else
                {
                    messageContent = isMine ? $"You: {lastMessage?.Content}" : lastMessage?.Content ?? string.Empty;
                }

                return new UserListChatResponseDTO
                {
                    UserId = friend.UserId,
                    UserName = friend.UserName,
                    Img = friend.Img,
                    MessageContent = messageContent,
                    IsMine = isMine,
                    Timestamp = lastMessage?.Timestamp ?? DateTime.Now,
                    IsImage = lastMessage.isImage
                };
            })
                .OrderByDescending(chat => chat.Timestamp)
                .ToList();

            return chatList;
        }
        public async Task<List<UserListChatResponseDTO>> GetUsersListChatById(int id)
        {
            // Lấy thông tin người dùng theo email
            var user = await dbContext.Users
                .Include(u => u.Friends) // Bao gồm thông tin bạn bè
                .ThenInclude(f => f.FriendUser) // Bao gồm thông tin người bạn
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null || user.Friends == null)
            {
                return new List<UserListChatResponseDTO>();
            }

            var userFriends = user.Friends
                        .Where(f => f.Status == FriendStatus.Accepted)
                .Select(f => f.FriendUser)
                .Where(f => f != null) // Loại bỏ các bạn bè null
                .ToList();

            if (!userFriends.Any())
            {
                return new List<UserListChatResponseDTO>();
            }

            // Lấy tất cả tin nhắn liên quan đến người dùng hiện tại và bạn bè
            var friendUserIds = userFriends.Select(u => u.UserId).ToList();
            var currentUserId = user.UserId;

            var messages = await (from m in dbContext.Messages
                                  where (friendUserIds.Contains(m.SenderId) && m.ReceiverId == currentUserId)
                                     || (friendUserIds.Contains(m.ReceiverId) && m.SenderId == currentUserId)
                                  select new
                                  {
                                      m.Content,
                                      m.SenderId,
                                      m.ReceiverId,
                                      m.Timestamp,
                                      m.isImage
                                  }).ToListAsync();

            // Tạo danh sách kết quả với tin nhắn cuối cùng cho mỗi bạn bè
            var chatList = userFriends.Select(friend =>
            {
                // Lấy tin nhắn cuối cùng giữa người dùng và bạn
                var lastMessage = messages.Where(m =>
                                         (m.SenderId == friend.UserId && m.ReceiverId == currentUserId)
                                      || (m.SenderId == currentUserId && m.ReceiverId == friend.UserId))
                                          .OrderByDescending(m => m.Timestamp)
                                          .FirstOrDefault();

                var isMine = lastMessage?.SenderId == currentUserId;
                var isImg = lastMessage.isImage;
                var messageContent = "";
                if (isImg)
                {
                    messageContent = isMine ? $"You: Image.png" : "Image.png" ?? string.Empty;
                }
                else
                {
                    messageContent = isMine ? $"You: {lastMessage?.Content}" : lastMessage?.Content ?? string.Empty;
                }

                return new UserListChatResponseDTO
                {
                    UserId = friend.UserId,
                    UserName = friend.UserName,
                    Img = friend.Img,
                    MessageContent = messageContent,
                    IsMine = isMine,
                    Timestamp = lastMessage?.Timestamp ?? DateTime.Now,
                    IsImage = lastMessage.isImage
                };
            })
                .OrderByDescending(chat => chat.Timestamp)
                .ToList();

            return chatList;
        }
        public async Task SaveMessagesToDatabase(Message messages)
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
                MessageId = Guid.NewGuid(),
                SenderId = m.SenderId,
                Content = m.Content,
                ReceiverId = m.ReceiverId,
                Timestamp = m.Timestamp,
                IsImage = m.isImage
            }).ToList();

            return messageDtos;
        }
        public async Task<Users> GetUserById(int userId)
        {
            // Sử dụng Entity Framework Core để lấy người dùng theo ID
            return await dbContext.Users
                .Where(u => u.UserId == userId)
                .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<Users>> GetFriendsByUserId(int userId)
        {
            return await dbContext.Friends
                .Where(f => f.UserId == userId || f.FriendUserId == userId)
                .Select(f => f.UserId == userId ? f.FriendUser : f.User)
                .ToListAsync();
        }
    }
}
