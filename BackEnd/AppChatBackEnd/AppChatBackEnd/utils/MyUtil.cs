﻿using AppChat.Data;
using AppChat.Models.Entities;
using AppChat.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace AppChatBackEnd.utils
{
    public class MyUtil
    {
       
        public static PasswordHasher<Users> _passwordHasher = new PasswordHasher<Users>();
        public static String CreateCodeVerify()
        {
            Random random = new Random();
            int code = random.Next(100000, 999999);
            return code.ToString();
        }
        public static String CreatePasswordRandom() {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        //Tạo sẵn list friend cho tài khoản mới đăng ký 
        public static async Task CreateDefault(DataContext dbContext, Users mainUser)
        {
                // List to hold friend users
            var friendUsers = new List<Users>();
          
            var admin = dbContext.Users
           .Include(u => u.UserDetail)
           .SingleOrDefault(u => u.Email == "0982407940ab@gmail.com");
            friendUsers.Add(admin);

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
                    SenderId = friendUser.UserId,
                    ReceiverId = mainUser.UserId,
                    Content = $"Hello {mainUser.UserName},\n\n" +
            "Welcome to our chat application! We are thrilled to have you here.\n\n" +
            "If you have any questions or need assistance with anything, please do not hesitate to reach out to us. We are here to help and ensure you have the best experience possible.\n\n" +
            "Best regards,🐧🐧🐧\n" +
            $"{friendUser.UserName} .",
                    Timestamp = DateTime.Now,
                    isImage = false
                });
            }


            await dbContext.Messages.AddRangeAsync(messages);
            await dbContext.SaveChangesAsync();

           
        }
        public static string DecodeJwtTokenToEmail(string token)
        {
            var jwtHandler = new JwtSecurityTokenHandler();

            if (jwtHandler.CanReadToken(token))
            {
                var jwtToken = jwtHandler.ReadJwtToken(token);

                // Lấy giá trị của claim Email và Role
                var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
                var role = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "Role")?.Value;

               
                String result = email;

                return result;
            }
            else
            {
                return "Token không hợp lệ";
            }
        }
    }
}
