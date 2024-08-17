using AppChatBackEnd.DTO.Response;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace AppChatBackEnd.Controllers
{
    [Route("api/cloudinary")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;
        private string ApiKey = "";
        public CloudinaryController(IOptions<AppChatBackEnd.CloudinarySetting.CloudinarySettings> config)
        {
            var account = new CloudinaryDotNet.Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            ApiKey = account.ApiKey;
            Console.WriteLine("this is user account");
            Console.WriteLine(config.Value.CloudName);
            Console.WriteLine(config.Value.ApiKey);
            Console.WriteLine(config.Value.ApiSecret);
            _cloudinary = new CloudinaryDotNet.Cloudinary(account);
        }

        [HttpGet("get-signature")]
        public IActionResult GetSignature()
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var signature = _cloudinary.Api.SignParameters(new SortedDictionary<string, object>
            {
                { "timestamp", timestamp }
            });
            Console.WriteLine($"Response JSON: {signature}");
            var response = new CloudinaryResponseDTO
            {
                Signature = signature + "",
                Timestamp = timestamp + "",
                ApiKey = ApiKey
            };

            return Ok(response);
        }

        [HttpPost("remove-image/{public_id}")]
        public async Task<IActionResult> RemoveImage(string public_id)
        {
            try
            {
                var deletionParams = new DeletionParams(public_id)
                {
                    ResourceType = ResourceType.Image 
                };

                var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

                if (deletionResult.Result == "ok")
                {
                    return Ok(new { message = "Image deleted successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to delete image.", result = deletionResult });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the image.", error = ex.Message });
            }
        }

    }
}
