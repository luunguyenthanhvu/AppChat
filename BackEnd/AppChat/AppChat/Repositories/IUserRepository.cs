using AppChat.DTO.Request;
using AppChat.DTO.Response;
using AppChat.Models.Entities;

namespace AppChat.Repositories
{
    public interface IUserRepository
    {
        Task<MessageResponseDTO> CreateNewUser(Users users);
    }
}
