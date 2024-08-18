using AppChatBackEnd.CloudinarySetting;
using CloudinaryDotNet; // Đây là namespace

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var cloudinarySettings = new CloudinarySettings();
        configuration.GetSection("CloudinarySettings").Bind(cloudinarySettings);

        var account = new Account(
            cloudinarySettings.CloudName,
            cloudinarySettings.ApiKey,
            cloudinarySettings.ApiSecret);

        _cloudinary = new CloudinaryDotNet.Cloudinary(account);
    }
    public string GetSignature(string publicId, string timestamp)
    {
        var parameters = new SortedDictionary<string, object>
        {
            { "public_id", publicId },
            { "timestamp", timestamp }
        };

        // Tạo chữ ký cho việc upload
        var apiSecret = _cloudinary.Api.SignParameters(parameters);
        return apiSecret;
    }
}
