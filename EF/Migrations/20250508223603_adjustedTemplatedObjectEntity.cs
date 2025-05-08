using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class adjustedTemplatedObjectEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorldObjects_Templates_TemplateId",
                table: "WorldObjects");

            migrationBuilder.AddForeignKey(
                name: "FK_WorldObjects_Templates_TemplateId",
                table: "WorldObjects",
                column: "TemplateId",
                principalTable: "Templates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorldObjects_Templates_TemplateId",
                table: "WorldObjects");

            migrationBuilder.AddForeignKey(
                name: "FK_WorldObjects_Templates_TemplateId",
                table: "WorldObjects",
                column: "TemplateId",
                principalTable: "Templates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
