using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;
using AppChatBackEnd.DTO.Request.ChatRequest;
using AppChatBackEnd.DTO.Response.ChatResponse;
using AppChatBackEnd.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AppChatBackEnd.Controllers
{
    [Route("api/mark-up/user-info")]
    [ApiController]
    public class VuLuuMarkUpController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IVuLuuMarkUpRepository markUpRepository;

        public VuLuuMarkUpController(IMapper mapper, IVuLuuMarkUpRepository markUpRepository)
        {
            this.mapper = mapper;
            this.markUpRepository = markUpRepository;
        }

        [HttpPut("update-image")]
        public async Task<IActionResult> UpdateImage([FromBody] UpdateImageRequestDTO request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.ImageUrl))
            {
                return BadRequest("Invalid input");
            }

            var result = await markUpRepository.UpdateUserImg(request.Email, request.ImageUrl);
            if (result == "Update success")
            {
                return Ok(result);
            }
            else
            {
                return StatusCode(500, result);
            }
        }

        [HttpGet("details-email")]
        public async Task<IActionResult> GetUserDetailsByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            var userDetails = await markUpRepository.GetUserDetailsByEmailAsync(email);

            if (userDetails == null)
            {
                return NotFound("User not found");
            }

            return Ok(userDetails);
        }

        [HttpGet("details-id")]
        public async Task<IActionResult> GetUserDetailsById([FromQuery] int id)
        {
            var userDetails = await markUpRepository.GetUserDetailsByIdAsync(id);

            if (userDetails == null)
            {
                return NotFound("User not found");
            }

            return Ok(userDetails);
        }

        // New endpoint to update user information
        [HttpPut("update-info")]
        public async Task<IActionResult> UpdateUserInfo([FromBody] UpdateUserDetailsRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Invalid input");
            }

            var result = await markUpRepository.UpdateUserInfoAsync(request);
            if (result == "Update success")
            {
                return Ok(result);
            }
            else
            {
                return StatusCode(500, result);
            }
        }
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequestDTO request)
        {
            var result = await markUpRepository.UpdateUserPassword(request);
            if (result == "Password updated successfully")
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}
