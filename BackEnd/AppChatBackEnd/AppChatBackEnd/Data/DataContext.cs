using AppChat.Models.Entities;
using AppChatBackEnd.Models.Entities;
using AppChatBackEnd.utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Reflection.Emit;

namespace AppChat.Data
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration configuration;

        public DataContext(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Friend entity
            modelBuilder.Entity<Friend>()
                .HasKey(f => f.FriendId);

            modelBuilder.Entity<Friend>()
                .HasOne(f => f.User)
                .WithMany(u => u.Friends)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friend>()
                .HasOne(f => f.FriendUser)
                .WithMany()
                .HasForeignKey(f => f.FriendUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friend>()
                .Property(f => f.FriendId)
                .ValueGeneratedOnAdd(); // Ensures auto-increment behavior

            // Configure User entity
            modelBuilder.Entity<Users>()
                .HasKey(u => u.UserId); // Ensure primary key configuration

            modelBuilder.Entity<Users>()
                .Property(u => u.UserId)
                .ValueGeneratedOnAdd(); // Auto-increment UserId

            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure Message entity
            modelBuilder.Entity<Message>()
                .HasKey(m => m.MessageId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.MessagesSent)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.MessagesReceived)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .Property(m => m.MessageId)
                .ValueGeneratedOnAdd(); // Auto-increment MessageId

            //Tạo db Role
            modelBuilder.Entity<Role>()
            .HasData(
                new Role { RoleId = 1, RoleName = "admin" },
                new Role { RoleId = 2, RoleName = "user" }
            );

            // Tạo dữ liệu User mặc định với vai trò admin
            modelBuilder.Entity<UserDetails>().HasData(
            new UserDetails
            {
                UserDetailId = 10000,
                Dob = DateTime.Parse("2003-08-29"),
                FirstName = "Yukihira",
                LastName = "Yato",
                Verified = 1,
                Status = "Active",
                UserId = 10000 
            }
        );

            Users adminTemp = new Users
            {
                UserId = 1,
                UserName = "Yukihira",
                Password = "", // 
                Email = "0982407940ab@gmail.com",
                Img = "", // 
                RoleId = 1, // RoleId cho admin
                UserDetail = new UserDetails
                {
                    UserDetailId = 1,
                    Dob = DateTime.Parse("2003-08-29"), // 
                    FirstName = "Yukihira",
                    LastName = "Yato",
                    Verified = 1,
                    Status = "Active"
                }
            };
            var passwordHash= adminTemp.Password = MyUtil._passwordHasher.HashPassword(adminTemp, "Minhtu2003");
            modelBuilder.Entity<Users>()
                .HasData(
                      new Users
                      {
                          UserId = 10000,
                          UserName = "Yukihira",
                          Password = passwordHash, 
                          Email = "0982407940ab@gmail.com",
                          Img = "http://res.cloudinary.com/dter3mlpl/image/upload/v1724040235/nnb6lhbvdiiucwdskh5u.jpg",
                          RoleId = 1, // RoleId cho admin
                         
                      }
                );


            // Cấu hình mối quan hệ giữa User và Role
            modelBuilder.Entity<Users>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);
            //Tạo db UserDetail
            modelBuilder.Entity<UserDetails>()
                .HasKey(ud => ud.UserDetailId);
            modelBuilder.Entity<UserDetails>()
              .Property(ud => ud.UserId)
              .ValueGeneratedOnAdd(); // Auto-increment UserId
            modelBuilder.Entity<UserDetails>()
            .HasIndex(ud => ud.UserId)
            .IsUnique();

            //Tạo mối quan hệ giữ Users và UserDetails
            modelBuilder.Entity<Users>()
        .HasOne(u => u.UserDetail)
        .WithOne(ud => ud.User)
        .HasForeignKey<UserDetails>(ud => ud.UserId)
        .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Reports>()
        .HasOne(r => r.ReportingUser)
        .WithMany(u => u.ReportsAsReporter)
        .HasForeignKey(r => r.ReportingUserId)
        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reports>()
                .HasOne(r => r.ReportedUser)
                .WithMany(u => u.ReportsAsReported)
                .HasForeignKey(r => r.ReportedUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }


        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var connectionString = configuration.GetConnectionString("WebApiDatabase");
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Reports> Reports { get; set; }
    }
}
