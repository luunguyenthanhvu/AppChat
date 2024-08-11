using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AutoMapper;

namespace AppChatBackEnd.MapperChat
{
    public class MapperChatDTO : Profile
    {
        public MapperChatDTO()
        {
            {
                // Map from Users entity to LoginResponseDTO
                CreateMap<Users, LoginResponseDTO>()
                    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                    .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Password))
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                    .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img));
            }
        }
    }
}
