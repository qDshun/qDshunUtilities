using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddNameAndImageUrlToWorldEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Worlds",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Worlds",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Worlds");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Worlds");
        }
    }
}
