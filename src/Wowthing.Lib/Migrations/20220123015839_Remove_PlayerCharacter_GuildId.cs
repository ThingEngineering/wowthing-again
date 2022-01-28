using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerCharacter_GuildId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "guild_id",
                table: "player_character");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "guild_id",
                table: "player_character",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
