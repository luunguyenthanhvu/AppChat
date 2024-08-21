using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppChatBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Users_ReportingUserId",
                table: "Reports");

            migrationBuilder.AlterColumn<int>(
                name: "reportAmount",
                table: "UserDetails",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "UserDetails",
                keyColumn: "UserDetailId",
                keyValue: 10000,
                column: "reportAmount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 10000,
                column: "Password",
                value: "AQAAAAIAAYagAAAAEH2+VJqqsyDSDqIpgeWqBNXcSf3MMoFUoLubMZ/heUCqbPtzy5wH64dLossjhyDvuw==");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedUserId",
                table: "Reports",
                column: "ReportedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Users_ReportedUserId",
                table: "Reports",
                column: "ReportedUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Users_ReportingUserId",
                table: "Reports",
                column: "ReportingUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Users_ReportedUserId",
                table: "Reports");

            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Users_ReportingUserId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_ReportedUserId",
                table: "Reports");

            migrationBuilder.AlterColumn<int>(
                name: "reportAmount",
                table: "UserDetails",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "UserDetails",
                keyColumn: "UserDetailId",
                keyValue: 10000,
                column: "reportAmount",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 10000,
                column: "Password",
                value: "AQAAAAIAAYagAAAAENEeNsa8sIduybEdQfLho++5IqsiHuqdBEKwDjQ3ra8Fa1MTHRdMG+zlOPfr4/hO4Q==");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Users_ReportingUserId",
                table: "Reports",
                column: "ReportingUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
