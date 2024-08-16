﻿using AppChat.Data;
using AppChatBackEnd.ChatHub;
using AppChatBackEnd.Connection.NewFolder;
using AppChatBackEnd.Connection.WebSocketConnection;
using AppChatBackEnd.Repositories;
using AppChatBackEnd.Repositories.RepositoriesImpl;
using Microsoft.EntityFrameworkCore;

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

// setting cloudinary
builder.Services.Configure<AppChatBackEnd.CloudinarySetting.CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings")
);

// Add auto mapper
builder.Services.AddAutoMapper(typeof(Program));

// inject repo
builder.Services.AddScoped<IChatRepository, ChatRepositoryImpl>();

// accept cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// add connection
builder.Services.AddSingleton<UserSessionManager>();
builder.Services.AddSignalR();
builder.Services.AddSingleton<MessageQueue>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();
app.UseCors("AllowAll");

app.UseAuthorization();
app.UseAuthentication(); // Thêm nếu bạn cần xác thực JWT

app.MapControllers();
app.MapHub<ChatHub>("/Chat"); // Đảm bảo endpoint khớp với client

app.Run();
