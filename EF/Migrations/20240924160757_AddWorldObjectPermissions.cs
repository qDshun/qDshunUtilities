using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddWorldObjectPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorldObjectPermissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldObjectId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    WorldUserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorldObjectPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorldObjectPermissions_WorldObjects_WorldObjectId",
                        column: x => x.WorldObjectId,
                        principalTable: "WorldObjects",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WorldObjectPermissions_WorldUsers_WorldUserId",
                        column: x => x.WorldUserId,
                        principalTable: "WorldUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_WorldObjectPermissions_WorldObjectId",
                table: "WorldObjectPermissions",
                column: "WorldObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_WorldObjectPermissions_WorldUserId",
                table: "WorldObjectPermissions",
                column: "WorldUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorldObjectPermissions");
        }
    }
}
