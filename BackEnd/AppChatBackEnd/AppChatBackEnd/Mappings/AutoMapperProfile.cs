using AutoMapper;
using AppChat.Models.Entities;
using AppChat.DTO.Request;
using AppChatBackEnd.DTO.Response;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.Models.Entities;

namespace AppChat.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapping from CreateUserRequestDTO to Users entity
            CreateMap<CreateUserRequestDTO, Users>()
     .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img))
     .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
     .ForMember(dest => dest.UserDetail, opt => opt.Ignore()) // Nếu bạn không cần ánh xạ UserDetail
     .ForMember(dest => dest.UserId, opt => opt.Ignore()); // Bỏ qua UserId vì nó được tự động sinh


            // Mapping from Users entity to UserDTO
            CreateMap<Users, UserDTO>()
                .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img));

            // Mapping for other DTOs and entities
            CreateMap<FriendRequestDTO, Friend>();
            CreateMap<Users, FriendRequestDTO>();
        }
    }
}