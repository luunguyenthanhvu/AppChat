using AppChat.Data;
using AppChatBackEnd.Models.EmailModel;
using AppChatBackEnd.Models.SecretKeyModel;
using AppChatBackEnd.Services.imp;
using AppChatBackEnd.Services.template;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// inject db context
builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("WebApiDatabase"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("WebApiDatabase"))
    ));
// Thêm cấu hình gửi Email
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddSingleton(resolver =>
    resolver.GetRequiredService<IOptions<MailSettings>>().Value);
builder.Services.AddTransient<IMailService,MailServiceImpl>();
// Cấu hình JWT
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
var scretKey = builder.Configuration["AppSettings:SecretKey"];
var scretKeyByte = Encoding.UTF8.GetBytes(scretKey);
builder.Services.AddTransient<ISendDataLogin, SendDataLoginImpl>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        //tự cấp token
        ValidateIssuer = false,
        ValidateAudience = false,
        //ký vào token
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(scretKeyByte),

        ClockSkew = TimeSpan.Zero,

    };


});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
