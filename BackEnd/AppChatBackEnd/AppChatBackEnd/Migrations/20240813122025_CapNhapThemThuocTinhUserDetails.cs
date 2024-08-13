using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class CapNhapThemThuocTinhUserDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "reportAmount",
                table: "UserDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "UserDetails",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportAmount",
                table: "UserDetails");

            migrationBuilder.DropColumn(
                name: "status",
                table: "UserDetails");
        }
    }
}
