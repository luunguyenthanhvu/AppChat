using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 11,
                column: "Password",
                value: "AQAAAAIAAYagAAAAEHxAbQp2AaDP0yvOVbOz0RDkMFFIka/N/y0mQcqef/4q+bVtSQiPfLL02EFgSXfJ2Q==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 11,
                column: "Password",
                value: "AQAAAAIAAYagAAAAEDPIb9P1Y0EhmG7ziXHFN0XG+K2Xyiuk6zIVFlGiAKa4XHhpuiqY9H1qnPhtyt6lvQ==");
        }
    }
}
