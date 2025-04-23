using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddObjectField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ObjectFields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    WorldObjectId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObjectFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ObjectFields_WorldObjects_WorldObjectId",
                        column: x => x.WorldObjectId,
                        principalTable: "WorldObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_WorldObjects_WorldId",
                table: "WorldObjects",
                column: "WorldId");

            migrationBuilder.CreateIndex(
                name: "IX_ObjectFields_WorldObjectId",
                table: "ObjectFields",
                column: "WorldObjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorldObjects_Worlds_WorldId",
                table: "WorldObjects",
                column: "WorldId",
                principalTable: "Worlds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorldObjects_Worlds_WorldId",
                table: "WorldObjects");

            migrationBuilder.DropTable(
                name: "ObjectFields");

            migrationBuilder.DropIndex(
                name: "IX_WorldObjects_WorldId",
                table: "WorldObjects");
        }
    }
}
