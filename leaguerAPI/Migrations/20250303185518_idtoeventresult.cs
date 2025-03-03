using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class idtoeventresult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EventResults",
                table: "EventResults");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventResults",
                table: "EventResults",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_EventResults_EventId",
                table: "EventResults",
                column: "EventId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EventResults",
                table: "EventResults");

            migrationBuilder.DropIndex(
                name: "IX_EventResults_EventId",
                table: "EventResults");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "EventResults");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventResults",
                table: "EventResults",
                column: "EventId");
        }
    }
}
