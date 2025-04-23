using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddedChatLine3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "ChatLines",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "lineText",
                table: "ChatLines",
                newName: "MessageText");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ChatLines",
                newName: "createdAt");

            migrationBuilder.RenameColumn(
                name: "MessageText",
                table: "ChatLines",
                newName: "lineText");
        }
    }
}
