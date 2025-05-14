using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class eventuserstatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "EventUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_EventUsers_Status",
                table: "EventUsers",
                column: "Status");

            migrationBuilder.AddCheckConstraint(
                name: "CK_EventUsers_Status",
                table: "EventUsers",
                sql: "\"Status\" BETWEEN 0 AND 2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EventUsers_Status",
                table: "EventUsers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_EventUsers_Status",
                table: "EventUsers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "EventUsers");
        }
    }
}
