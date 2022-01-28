using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacter_GuildId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "guild_id",
                table: "player_character",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_player_character_guild_id",
                table: "player_character",
                column: "guild_id");

            migrationBuilder.AddForeignKey(
                name: "fk_player_character_player_guild_guild_id",
                table: "player_character",
                column: "guild_id",
                principalTable: "player_guild",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_player_character_player_guild_guild_id",
                table: "player_character");

            migrationBuilder.DropIndex(
                name: "ix_player_character_guild_id",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "guild_id",
                table: "player_character");
        }
    }
}
