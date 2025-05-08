using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qDshunUtilities.EF.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedObjectField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ParentId",
                table: "ObjectFields",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ObjectFields_ParentId",
                table: "ObjectFields",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ObjectFields_ObjectFields_ParentId",
                table: "ObjectFields",
                column: "ParentId",
                principalTable: "ObjectFields",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ObjectFields_ObjectFields_ParentId",
                table: "ObjectFields");

            migrationBuilder.DropIndex(
                name: "IX_ObjectFields_ParentId",
                table: "ObjectFields");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "ObjectFields");
        }
    }
}
