using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class ChangeLootItemCountToExpression : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Count",
                table: "LootItems");

            migrationBuilder.AddColumn<string>(
                name: "CountExpression",
                table: "LootItems",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountExpression",
                table: "LootItems");

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "LootItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
