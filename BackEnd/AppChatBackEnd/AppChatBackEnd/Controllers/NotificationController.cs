using AppChat.Data;
using AppChat.Models.Entities;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly DataContext _context;

        public NotificationController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("send-notification")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequestDTO request)
        {
            if (request == null || string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Invalid notification request.");
            }

            var users = _context.Users.Where(u => !string.IsNullOrEmpty(u.FcmToken)).ToList();
            if (!users.Any())
            {
                return NotFound("No users with FCM tokens found.");
            }

            var fcmTokens = users.Select(u => u.FcmToken).ToList();
            var message = new MulticastMessage()
            {
                Tokens = fcmTokens,
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = request.Title ?? "New Notification",
                    Body = request.Message
                }
            };

            try
            {
                var response = await FirebaseMessaging.DefaultInstance.SendMulticastAsync(message);
                return Ok(new { Success = true, Response = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending the notification: {ex.Message}");
            }
        }
    }

    public class NotificationRequestDTO
    {
        public string Title { get; set; }
        public string Message { get; set; }
    }
}
