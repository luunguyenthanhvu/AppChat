using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 11,
                column: "Password",
                value: "AQAAAAIAAYagAAAAEGCp7ckptXtLPF49RVBkvHbHh6+8Y0k291sL9Y6iJTsvLDoYQCiXykW18uPZ4jibDQ==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 11,
                column: "Password",
                value: "AQAAAAIAAYagAAAAEHxAbQp2AaDP0yvOVbOz0RDkMFFIka/N/y0mQcqef/4q+bVtSQiPfLL02EFgSXfJ2Q==");
        }
    }
}
