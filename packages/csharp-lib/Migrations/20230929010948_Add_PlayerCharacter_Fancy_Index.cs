using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacter_Fancy_Index : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character");

            migrationBuilder.CreateIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character",
                column: "last_api_check",
                filter: "should_update = true AND account_id IS NOT NULL")
                .Annotation("Npgsql:IndexInclude", new[] { "id", "account_id", "name", "last_api_modified" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character");

            migrationBuilder.CreateIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character",
                column: "last_api_check");
        }
    }
}
