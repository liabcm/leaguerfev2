using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class removeUserInvite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserInvites");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LeagueUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<Guid>(
                name: "WinningUserId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "WinningTeamId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_LeagueUsers_Status",
                table: "LeagueUsers",
                column: "Status");

            migrationBuilder.AddCheckConstraint(
                name: "CK_LeagueUsers_Status",
                table: "LeagueUsers",
                sql: "Status BETWEEN 0 AND 4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LeagueUsers_Status",
                table: "LeagueUsers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_LeagueUsers_Status",
                table: "LeagueUsers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LeagueUsers");

            migrationBuilder.AlterColumn<Guid>(
                name: "WinningUserId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "WinningTeamId",
                table: "EventResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "UserInvites",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeagueId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInvites", x => new { x.UserId, x.LeagueId });
                    table.ForeignKey(
                        name: "FK_UserInvites_Leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "Leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserInvites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserInvites_IsDeleted",
                table: "UserInvites",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserInvites_LeagueId",
                table: "UserInvites",
                column: "LeagueId");
        }
    }
}
