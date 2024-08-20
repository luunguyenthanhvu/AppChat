﻿using System.ComponentModel.DataAnnotations;

namespace AppChatBackEnd.DTO.Response.ChatResponse
{
    public class LoginResponseDTO
    {
        public string UserName { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        public string Img { get; set; }
        public string Token { get; set; }
    }
}
