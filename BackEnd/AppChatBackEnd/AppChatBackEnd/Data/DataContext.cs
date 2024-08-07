using AppChat.Models.Entities;
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
        }


        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var connectionString = configuration.GetConnectionString("WebApiDatabase");
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}
