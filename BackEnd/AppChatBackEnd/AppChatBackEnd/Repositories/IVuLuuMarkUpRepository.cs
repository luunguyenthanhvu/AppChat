using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;

namespace AppChatBackEnd.Repositories
{
    public interface IVuLuuMarkUpRepository
    {
        Task<string> UpdateUserImg(string userEmail, string img);
        Task<UserDetailRequestDTO> GetUserDetailsByEmailAsync(string email);
        Task<UserDetailRequestDTO> GetUserDetailsByIdAsync(int id);
    }
}
