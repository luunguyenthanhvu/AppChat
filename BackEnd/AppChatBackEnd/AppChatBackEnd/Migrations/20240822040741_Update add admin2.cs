using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class Updateaddadmin2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserDetailId",
                keyValue: 10000);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 10000);

            migrationBuilder.DropColumn(
                name: "Img",
                table: "UserDetails");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "Img", "Password", "RoleId", "UserName" },
                values: new object[] { 11, "0982407940ab@gmail.com", "http://res.cloudinary.com/dter3mlpl/image/upload/v1724040235/nnb6lhbvdiiucwdskh5u.jpg", "AQAAAAIAAYagAAAAEP4CdBMBkOacCREeKIcu2BaiFsmD1JMXjlnqWRqbfr8v5nU+mAeasQat6cKUSqUNEQ==", 1, "Yukihira" });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserDetailId", "Dob", "FirstName", "Gender", "LastName", "Otp", "OtpExpiryTime", "PhoneNumber", "Status", "UserId", "Verified", "reportAmount" },
                values: new object[] { 11, new DateTime(2003, 8, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yukihira", null, "Yato", null, null, null, "Active", 11, 1, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserDetailId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 11);

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "UserDetails",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "Img", "Password", "RoleId", "UserName" },
                values: new object[] { 10000, "0982407940ab@gmail.com", "http://res.cloudinary.com/dter3mlpl/image/upload/v1724040235/nnb6lhbvdiiucwdskh5u.jpg", "AQAAAAIAAYagAAAAEH2+VJqqsyDSDqIpgeWqBNXcSf3MMoFUoLubMZ/heUCqbPtzy5wH64dLossjhyDvuw==", 1, "Yukihira" });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserDetailId", "Dob", "FirstName", "Gender", "Img", "LastName", "Otp", "OtpExpiryTime", "PhoneNumber", "Status", "UserId", "Verified", "reportAmount" },
                values: new object[] { 10000, new DateTime(2003, 8, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yukihira", null, null, "Yato", null, null, null, "Active", 10000, 1, 0 });
        }
    }
}
