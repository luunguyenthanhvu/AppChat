using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Response;

namespace AppChatBackEnd.Services.template
{
    public interface ISendDataLogin
    {
        public  Task<LoginResponseDTO> sendDataLogin(Users users);
    }
}
