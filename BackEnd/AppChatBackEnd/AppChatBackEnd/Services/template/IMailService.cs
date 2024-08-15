using AppChat.Models.Entities;
using AppChatBackEnd.Models.EmailModel;

namespace AppChatBackEnd.Services.template
{
    public interface IMailService
    {
        Task SendCodeEmailAsync(String emailUser, String otp);
        Task <String> SendCodeForForgotPassword(String emailUser);
    }
}
