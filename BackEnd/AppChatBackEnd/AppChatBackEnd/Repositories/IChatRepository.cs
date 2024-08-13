using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Response.ChatResponse;

namespace AppChatBackEnd.Repositories
{
    public interface IChatRepository
    {
        Task<Users?> GetUsersByEmail(String email);

        Task<Users?> CreateDefault();

        Task<List<UserListChatResponseDTO>> GetUsersListChatByEmail(String email);
        Task<List<ListMessageResponseDTO>> GetUserMessage(int userId, int userChattingId);

        Task SaveMessagesToDatabase(Message messages);
    }
}
