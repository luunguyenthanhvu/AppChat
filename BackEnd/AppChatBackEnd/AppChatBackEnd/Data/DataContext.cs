using AppChat.Models.Entities;
using AppChatBackEnd.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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
            modelBuilder.Entity<Friend>()
                .HasKey(f => f.FriendId);

            // db relationship
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

            // set auto increment
            modelBuilder.Entity<Friend>()
                .Property(f => f.FriendId)
                .ValueGeneratedOnAdd();

            // unique email
            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Message>()
                .HasKey(m => m.MessageId);

            // db relationship
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
                .ValueGeneratedOnAdd();

            //Tạo db Role
            modelBuilder.Entity<Role>()
            .HasData(
                new Role { RoleId = 1, RoleName = "admin" },
                new Role { RoleId = 2, RoleName = "user" }
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
            .HasIndex(ud => ud.UserId)
            .IsUnique();

            //Tạo mối quan hệ giữ Users và UserDetails
            modelBuilder.Entity<Users>()
        .HasOne(u => u.UserDetail)
        .WithOne(ud => ud.User)
        .HasForeignKey<UserDetails>(ud => ud.UserId)
        .OnDelete(DeleteBehavior.Cascade);



        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var connectionString = configuration.GetConnectionString("WebApiDatabase");
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; } 
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Role> Roles { get; set; }  
    }
}
