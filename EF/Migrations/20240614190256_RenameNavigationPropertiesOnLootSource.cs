using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class RenameNavigationPropertiesOnLootSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LootSources_Worlds_WorldEntityId",
                table: "LootSources");

            migrationBuilder.DropIndex(
                name: "IX_LootSources_WorldEntityId",
                table: "LootSources");

            migrationBuilder.DropColumn(
                name: "WorldEntityId",
                table: "LootSources");

            migrationBuilder.AddColumn<Guid>(
                name: "WorldId",
                table: "LootSources",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_LootSources_WorldId",
                table: "LootSources",
                column: "WorldId");

            migrationBuilder.AddForeignKey(
                name: "FK_LootSources_Worlds_WorldId",
                table: "LootSources",
                column: "WorldId",
                principalTable: "Worlds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LootSources_Worlds_WorldId",
                table: "LootSources");

            migrationBuilder.DropIndex(
                name: "IX_LootSources_WorldId",
                table: "LootSources");

            migrationBuilder.DropColumn(
                name: "WorldId",
                table: "LootSources");

            migrationBuilder.AddColumn<Guid>(
                name: "WorldEntityId",
                table: "LootSources",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_LootSources_WorldEntityId",
                table: "LootSources",
                column: "WorldEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_LootSources_Worlds_WorldEntityId",
                table: "LootSources",
                column: "WorldEntityId",
                principalTable: "Worlds",
                principalColumn: "Id");
        }
    }
}
