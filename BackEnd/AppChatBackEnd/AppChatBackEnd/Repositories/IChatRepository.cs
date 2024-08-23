using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Response.ChatResponse;

namespace AppChatBackEnd.Repositories
{
    public interface IChatRepository
    {
        Task<Users?> GetUsersByEmail(String email);
        Task<Users> GetUsersById(int id);
        Task<Users?> CreateDefault();

        Task<List<UserListChatResponseDTO>> GetUsersListChatByEmail(String email);
        Task<List<UserListChatResponseDTO>> GetUsersFriendListChatByEmailAndUserName(String email, string username);
        Task<List<UserListChatResponseDTO>> GetUsersListChatById(int id);
        Task<List<ListMessageResponseDTO>> GetUserMessage(int userId, int userChattingId);

        Task SaveMessagesToDatabase(Message messages);
        Task<Users> GetUserById(int userId);
        Task<IEnumerable<Users>> GetFriendsByUserId(int userId);
    }
}
