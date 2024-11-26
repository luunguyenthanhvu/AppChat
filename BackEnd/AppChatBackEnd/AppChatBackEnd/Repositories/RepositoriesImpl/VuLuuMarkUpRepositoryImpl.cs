using AppChat.Data;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.utils;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AppChatBackEnd.Repositories.RepositoriesImpl
{
    public class VuLuuMarkUpRepositoryImpl : IVuLuuMarkUpRepository
    {
        private readonly DataContext dbContext;

        public VuLuuMarkUpRepositoryImpl(DataContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<string> UpdateUserImg(string userEmail, string img)
        {
            var existingUser = await dbContext.Users.FirstOrDefaultAsync(x => x.Email.Equals(userEmail));
            if (existingUser == null)
            {
                return "User not found";
            }

            existingUser.Img = img;

            await dbContext.SaveChangesAsync();
            return "Update success";
        }
        public async Task<UserDetailRequestDTO> GetUserDetailsByEmailAsync(string email)
        {
            var user = dbContext.Users
                .Where(u => u.Email == email)
                .Select(u => new UserDetailRequestDTO
                {
                    FirstName = u.UserDetail.FirstName,
                    LastName = u.UserDetail.LastName,
                    Gender = u.UserDetail.Gender,
                    Dob = u.UserDetail.Dob.HasValue ? u.UserDetail.Dob.Value.ToString("dd/MM/yyyy") : null,
                    UserName = u.UserName,
                    Img = u.Img
                })
                .FirstOrDefault();

            return user;
        }
        public async Task<UserDetailRequestDTO> GetUserDetailsByIdAsync(int id)
        {
            var user = dbContext.Users
               .Where(u => u.UserId == id)
               .Select(u => new UserDetailRequestDTO
               {
                   FirstName = u.UserDetail.FirstName,
                   LastName = u.UserDetail.LastName,
                   Gender = u.UserDetail.Gender,
                   Dob = u.UserDetail.Dob.HasValue ? u.UserDetail.Dob.Value.ToString("dd/MM/yyyy") : null,
                   UserName = u.UserName,
                   Img = u.Img
               })
               .FirstOrDefault();
            return user;
        }
        public async Task<string> UpdateUserInfoAsync(UpdateUserDetailsRequestDTO userDetail)
        {
            var existingUser = await dbContext.Users
                .Include(u => u.UserDetail) // Ensure the UserDetail entity is included
                .FirstOrDefaultAsync(u => u.Email == userDetail.Email);

            if (existingUser == null)
            {
                return "User not found";
            }

            // Update user details
            existingUser.UserName = userDetail.UserName;
            existingUser.UserDetail.FirstName = userDetail.FirstName;
            existingUser.UserDetail.LastName = userDetail.LastName;
            existingUser.UserDetail.Gender = userDetail.Gender;
            if (!string.IsNullOrEmpty(userDetail.Dob))
            {
                var dobParts = userDetail.Dob.Split('/');
                existingUser.UserDetail.Dob = new DateTime(
                    int.Parse(dobParts[2]),
                    int.Parse(dobParts[1]),
                    int.Parse(dobParts[0])
                );
            }

            await dbContext.SaveChangesAsync();
            return "Update success";
        }

        public async Task<string> UpdateUserPassword(UpdatePasswordRequestDTO request)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Email.Equals(request.Email));
            user.Password = user.Password = MyUtil._passwordHasher.HashPassword(user, request.Password);
            await dbContext.SaveChangesAsync();
            return "Password updated successfully";
        }
    }
}
