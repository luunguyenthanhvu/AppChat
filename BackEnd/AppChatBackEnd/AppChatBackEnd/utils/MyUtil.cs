using AppChat.Models.Entities;
using Microsoft.AspNetCore.Identity;

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
    }
}
