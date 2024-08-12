using AppChat.Data;
using AppChat.Mapping;
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

// Add auto mapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
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
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
