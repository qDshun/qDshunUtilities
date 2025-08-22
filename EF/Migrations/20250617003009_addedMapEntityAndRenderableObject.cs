using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations;

/// <inheritdoc />
public partial class addedMapEntityAndRenderableObject : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Maps",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                CellSize = table.Column<int>(type: "int", nullable: false),
                StrokeColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                BackgroundColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Width = table.Column<int>(type: "int", nullable: false),
                Height = table.Column<int>(type: "int", nullable: false),
                GridType = table.Column<int>(type: "int", nullable: false),
                WorldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Maps", x => x.Id);
                table.ForeignKey(
                    name: "FK_Maps_Worlds_WorldId",
                    column: x => x.WorldId,
                    principalTable: "Worlds",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "RenderableObjects",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Type = table.Column<int>(type: "int", nullable: false),
                ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Snapping = table.Column<int>(type: "int", nullable: false),
                LayerType = table.Column<int>(type: "int", nullable: false),
                MapId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RenderableObjects", x => x.Id);
                table.ForeignKey(
                    name: "FK_RenderableObjects_Maps_MapId",
                    column: x => x.MapId,
                    principalTable: "Maps",
                    principalColumn: "Id");
            });

        migrationBuilder.CreateIndex(
            name: "IX_Maps_WorldId",
            table: "Maps",
            column: "WorldId");

        migrationBuilder.CreateIndex(
            name: "IX_RenderableObjects_MapId",
            table: "RenderableObjects",
            column: "MapId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "RenderableObjects");

        migrationBuilder.DropTable(
            name: "Maps");
    }
}
