﻿// <auto-generated />
using System;
using AppChat.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("AppChat.Models.Entities.Friend", b =>
                {
                    b.Property<int>("FriendId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("FriendId"));

                    b.Property<int>("FriendUserId")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("FriendId");

                    b.HasIndex("FriendUserId");

                    b.HasIndex("UserId");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Message", b =>
                {
                    b.Property<int>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("MessageId"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("ReceiverId")
                        .HasColumnType("int");

                    b.Property<int>("SenderId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("isImage")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("MessageId");

                    b.HasIndex("ReceiverId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Users", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("UserId"));

                    b.Property<string>("Email")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Img")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("AppChatBackEnd.Models.Entities.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("RoleId"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            RoleId = 1,
                            RoleName = "admin"
                        },
                        new
                        {
                            RoleId = 2,
                            RoleName = "user"
                        });
                });

            modelBuilder.Entity("AppChatBackEnd.Models.Entities.UserDetails", b =>
                {
                    b.Property<int>("UserDetailId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("UserDetailId"));

                    b.Property<DateTime?>("Dob")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<string>("Gender")
                        .HasColumnType("longtext");

                    b.Property<string>("Img")
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("Otp")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("OtpExpiryTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int?>("Verified")
                        .HasColumnType("int");

                    b.Property<int?>("reportAmount")
                        .HasColumnType("int");

                    b.Property<int?>("status")
                        .HasColumnType("int");

                    b.HasKey("UserDetailId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserDetails");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Friend", b =>
                {
                    b.HasOne("AppChat.Models.Entities.Users", "FriendUser")
                        .WithMany()
                        .HasForeignKey("FriendUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("AppChat.Models.Entities.Users", "User")
                        .WithMany("Friends")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("FriendUser");

                    b.Navigation("User");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Message", b =>
                {
                    b.HasOne("AppChat.Models.Entities.Users", "Receiver")
                        .WithMany("MessagesReceived")
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("AppChat.Models.Entities.Users", "Sender")
                        .WithMany("MessagesSent")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Receiver");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Users", b =>
                {
                    b.HasOne("AppChatBackEnd.Models.Entities.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("AppChatBackEnd.Models.Entities.UserDetails", b =>
                {
                    b.HasOne("AppChat.Models.Entities.Users", "User")
                        .WithOne("UserDetail")
                        .HasForeignKey("AppChatBackEnd.Models.Entities.UserDetails", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("AppChat.Models.Entities.Users", b =>
                {
                    b.Navigation("Friends");

                    b.Navigation("MessagesReceived");

                    b.Navigation("MessagesSent");

                    b.Navigation("UserDetail")
                        .IsRequired();
                });

            modelBuilder.Entity("AppChatBackEnd.Models.Entities.Role", b =>
                {
                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
