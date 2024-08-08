using AutoMapper;
using AppChat.Models.Entities;
using AppChat.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.DTO.Request;

namespace AppChat.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapping from CreateUserRequestDTO to Users entity
            CreateMap<CreateUserRequestDTO, Users>();

            // Mapping from Users entity to UserDto
            CreateMap<Users, UserDTO>();

            // Add other mappings here
            CreateMap<FriendRequestDTO, Friend>();
            CreateMap<Users, FriendRequestDTO>();
        }
    }
}
