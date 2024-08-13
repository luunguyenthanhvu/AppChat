using AppChatBackEnd.Models.EmailModel;
using AppChatBackEnd.Services.template;
using MailKit.Net.Smtp;
using MimeKit;

namespace AppChatBackEnd.Services.imp
{
    public class MailServiceImpl : IMailService
    {
        private MailSettings _mailSettings { get; set; }
        public MailServiceImpl(MailSettings MailSettings) { 
        _mailSettings = MailSettings;
        }

        public async Task SendCodeEmailAsync(String emailUser, String otp)
        {
          
            MailRequest mailRequest = new MailRequest
            {
                ToEmail = emailUser,
                Subject = "Xác minh tài khoản",
                Body = "Mã xác minh của bạn là : " +otp
            };
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;
            var builder = new BodyBuilder();
            
            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();
            using var smpt = new SmtpClient();
            smpt.Connect(_mailSettings.Host, _mailSettings.Port,MailKit.Security.SecureSocketOptions.StartTls);
            smpt.Authenticate(_mailSettings.Mail,_mailSettings.Password);
            await smpt.SendAsync(email);
            smpt.Disconnect(true);

           
        }


        
    }
}
