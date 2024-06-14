using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class RenameNavigationPropertiesOnLootItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LootItems_LootSources_LootSourceEntityId",
                table: "LootItems");

            migrationBuilder.DropIndex(
                name: "IX_LootItems_LootSourceEntityId",
                table: "LootItems");

            migrationBuilder.DropColumn(
                name: "LootSourceEntityId",
                table: "LootItems");

            migrationBuilder.AddColumn<Guid>(
                name: "LootSourceId",
                table: "LootItems",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_LootItems_LootSourceId",
                table: "LootItems",
                column: "LootSourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_LootItems_LootSources_LootSourceId",
                table: "LootItems",
                column: "LootSourceId",
                principalTable: "LootSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LootItems_LootSources_LootSourceId",
                table: "LootItems");

            migrationBuilder.DropIndex(
                name: "IX_LootItems_LootSourceId",
                table: "LootItems");

            migrationBuilder.DropColumn(
                name: "LootSourceId",
                table: "LootItems");

            migrationBuilder.AddColumn<Guid>(
                name: "LootSourceEntityId",
                table: "LootItems",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_LootItems_LootSourceEntityId",
                table: "LootItems",
                column: "LootSourceEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_LootItems_LootSources_LootSourceEntityId",
                table: "LootItems",
                column: "LootSourceEntityId",
                principalTable: "LootSources",
                principalColumn: "Id");
        }
    }
}
