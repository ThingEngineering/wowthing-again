using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerCharacterAchievements_JSONB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "achievement_timestamps",
                table: "player_character_achievements");

            migrationBuilder.DropColumn(
                name: "criteria_amounts",
                table: "player_character_achievements");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, int>>(
                name: "achievement_timestamps",
                table: "player_character_achievements",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<int, long>>(
                name: "criteria_amounts",
                table: "player_character_achievements",
                type: "jsonb",
                nullable: true);
        }
    }
}
