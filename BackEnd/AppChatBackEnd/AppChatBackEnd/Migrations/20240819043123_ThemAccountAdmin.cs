using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class ThemAccountAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "Img", "Password", "RoleId", "UserName" },
                values: new object[] { 10000, "0982407940ab@gmail.com", "http://res.cloudinary.com/dter3mlpl/image/upload/v1724040235/nnb6lhbvdiiucwdskh5u.jpg", "AQAAAAIAAYagAAAAENEeNsa8sIduybEdQfLho++5IqsiHuqdBEKwDjQ3ra8Fa1MTHRdMG+zlOPfr4/hO4Q==", 1, "Yukihira" });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserDetailId", "Dob", "FirstName", "Gender", "Img", "LastName", "Otp", "OtpExpiryTime", "PhoneNumber", "Status", "UserId", "Verified", "reportAmount" },
                values: new object[] { 10000, new DateTime(2003, 8, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yukihira", null, null, "Yato", null, null, null, "Active", 10000, 1, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserDetailId",
                keyValue: 10000);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 10000);
        }
    }
}
