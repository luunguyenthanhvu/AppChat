using AppChatBackEnd.DTO.Response.ChatResponse;

namespace AppChatBackEnd.NewFolder
{
    public class ChatService
    {
        public async Task<List<UserListChatResponseDTO>> GetUserListChatResponseDTOs(string email)
        {

            return await GetUserListChatResponseDTOs(email);
        }
    }
}
