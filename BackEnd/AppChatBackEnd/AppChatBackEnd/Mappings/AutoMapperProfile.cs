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
            CreateMap<CreateUserRequestDTO, Users>()
               .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img));

            CreateMap<Users, UserDTO>()
                .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img));
            // Add other mappings here
            CreateMap<FriendRequestDTO, Friend>();
            CreateMap<Users, FriendRequestDTO>();
        }
    }
}
