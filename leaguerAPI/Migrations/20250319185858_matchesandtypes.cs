using System;
using System.Threading;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class matchesandtypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                table: "Events");

            migrationBuilder.AlterColumn<Guid>(
                name: "LeagueId",
                table: "Events",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<int>(
                name: "EventType",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsTeamEvent",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "JoinType",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxParticipants",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Match",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    Opponent1Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Opponent2Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchNumber = table.Column<int>(type: "integer", nullable: false),
                    Round = table.Column<int>(type: "integer", nullable: false),
                    MatchResult = table.Column<ManualResetEvent>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Match", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Match_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Events_JoinType",
                table: "Events",
                column: "EventType");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Events_EventType",
                table: "Events",
                sql: "\"EventType\" BETWEEN 0 AND 3");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Events_JoinType",
                table: "Events",
                sql: "\"JoinType\" BETWEEN 0 AND 3");

            migrationBuilder.CreateIndex(
                name: "IX_Match_EventId",
                table: "Match",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Match");

            migrationBuilder.DropIndex(
                name: "IX_Events_JoinType",
                table: "Events");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Events_EventType",
                table: "Events");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Events_JoinType",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsTeamEvent",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "JoinType",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "MaxParticipants",
                table: "Events");

            migrationBuilder.AlterColumn<Guid>(
                name: "LeagueId",
                table: "Events",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
