using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class RenamedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LootItem");

            migrationBuilder.DropTable(
                name: "UserWorldUser");

            migrationBuilder.DropTable(
                name: "WorldWorldUser");

            migrationBuilder.DropTable(
                name: "LootSource");

            migrationBuilder.DropTable(
                name: "WorldUser");

            migrationBuilder.DropTable(
                name: "World");

            migrationBuilder.CreateTable(
                name: "Worlds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Worlds", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LootSources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldEntityId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LootSources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LootSources_Worlds_WorldEntityId",
                        column: x => x.WorldEntityId,
                        principalTable: "Worlds",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WorldUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorldUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorldUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorldUsers_Worlds_WorldId",
                        column: x => x.WorldId,
                        principalTable: "Worlds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LootItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LootSourceEntityId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LootItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LootItems_LootSources_LootSourceEntityId",
                        column: x => x.LootSourceEntityId,
                        principalTable: "LootSources",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_LootItems_LootSourceEntityId",
                table: "LootItems",
                column: "LootSourceEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_LootSources_WorldEntityId",
                table: "LootSources",
                column: "WorldEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_WorldUsers_UserId",
                table: "WorldUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorldUsers_WorldId",
                table: "WorldUsers",
                column: "WorldId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LootItems");

            migrationBuilder.DropTable(
                name: "WorldUsers");

            migrationBuilder.DropTable(
                name: "LootSources");

            migrationBuilder.DropTable(
                name: "Worlds");

            migrationBuilder.CreateTable(
                name: "World",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_World", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WorldUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorldUser", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LootSource",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LootSource", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LootSource_World_WorldId",
                        column: x => x.WorldId,
                        principalTable: "World",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserWorldUser",
                columns: table => new
                {
                    UsersId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldUsersId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWorldUser", x => new { x.UsersId, x.WorldUsersId });
                    table.ForeignKey(
                        name: "FK_UserWorldUser_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserWorldUser_WorldUser_WorldUsersId",
                        column: x => x.WorldUsersId,
                        principalTable: "WorldUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WorldWorldUser",
                columns: table => new
                {
                    WorldUsersId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    WorldsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorldWorldUser", x => new { x.WorldUsersId, x.WorldsId });
                    table.ForeignKey(
                        name: "FK_WorldWorldUser_WorldUser_WorldUsersId",
                        column: x => x.WorldUsersId,
                        principalTable: "WorldUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorldWorldUser_World_WorldsId",
                        column: x => x.WorldsId,
                        principalTable: "World",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LootItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LootSourceId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LootItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LootItem_LootSource_LootSourceId",
                        column: x => x.LootSourceId,
                        principalTable: "LootSource",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_LootItem_LootSourceId",
                table: "LootItem",
                column: "LootSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_LootSource_WorldId",
                table: "LootSource",
                column: "WorldId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWorldUser_WorldUsersId",
                table: "UserWorldUser",
                column: "WorldUsersId");

            migrationBuilder.CreateIndex(
                name: "IX_WorldWorldUser_WorldsId",
                table: "WorldWorldUser",
                column: "WorldsId");
        }
    }
}
