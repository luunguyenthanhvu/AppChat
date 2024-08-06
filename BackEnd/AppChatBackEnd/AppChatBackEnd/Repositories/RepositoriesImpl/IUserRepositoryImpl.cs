using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.DTO.Response;
using AppChat.Models.Entities;

namespace AppChat.Repositories.RepositoriesImpl
{
    public class IUserRepositoryImpl : IUserRepository
    {
        private readonly DataContext dbContext;

        public IUserRepositoryImpl(DataContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<MessageResponseDTO> CreateNewUser(Users users)
        {
            await dbContext.Users.AddAsync(users);
            await dbContext.SaveChangesAsync();
            return new MessageResponseDTO("Add User Successfully");
        }
    }
}