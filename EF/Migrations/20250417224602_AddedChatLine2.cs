using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddedChatLine2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatLines_AspNetUsers_UserId",
                table: "ChatLines");

            migrationBuilder.DropIndex(
                name: "IX_ChatLines_UserId",
                table: "ChatLines");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ChatLines");

            migrationBuilder.CreateIndex(
                name: "IX_ChatLines_WorldUserId",
                table: "ChatLines",
                column: "WorldUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatLines_WorldUsers_WorldUserId",
                table: "ChatLines",
                column: "WorldUserId",
                principalTable: "WorldUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatLines_WorldUsers_WorldUserId",
                table: "ChatLines");

            migrationBuilder.DropIndex(
                name: "IX_ChatLines_WorldUserId",
                table: "ChatLines");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "ChatLines",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_ChatLines_UserId",
                table: "ChatLines",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatLines_AspNetUsers_UserId",
                table: "ChatLines",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
