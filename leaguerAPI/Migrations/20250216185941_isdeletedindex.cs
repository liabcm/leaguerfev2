using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leaguerAPI.Migrations
{
    /// <inheritdoc />
    public partial class isdeletedindex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_LeagueUsers_IsDeleted",
                table: "LeagueUsers",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LeagueUsers_IsDeleted",
                table: "LeagueUsers");
        }
    }
}
