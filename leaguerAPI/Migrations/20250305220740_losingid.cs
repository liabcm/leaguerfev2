using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class losingid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LosingTeamId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LosingUserId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventResults_LosingTeamId",
                table: "EventResults",
                column: "LosingTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_EventResults_LosingUserId",
                table: "EventResults",
                column: "LosingUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventResults_Teams_LosingTeamId",
                table: "EventResults",
                column: "LosingTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventResults_Users_LosingUserId",
                table: "EventResults",
                column: "LosingUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventResults_Teams_LosingTeamId",
                table: "EventResults");

            migrationBuilder.DropForeignKey(
                name: "FK_EventResults_Users_LosingUserId",
                table: "EventResults");

            migrationBuilder.DropIndex(
                name: "IX_EventResults_LosingTeamId",
                table: "EventResults");

            migrationBuilder.DropIndex(
                name: "IX_EventResults_LosingUserId",
                table: "EventResults");

            migrationBuilder.DropColumn(
                name: "LosingTeamId",
                table: "EventResults");

            migrationBuilder.DropColumn(
                name: "LosingUserId",
                table: "EventResults");
        }
    }
}
