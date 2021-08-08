using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAchievements_Arrays : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "achievement_ids",
                table: "player_character_achievements",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "achievement_timestamps",
                table: "player_character_achievements",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<long>>(
                name: "criteria_amounts",
                table: "player_character_achievements",
                type: "bigint[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "criteria_ids",
                table: "player_character_achievements",
                type: "integer[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "achievement_ids",
                table: "player_character_achievements");

            migrationBuilder.DropColumn(
                name: "achievement_timestamps",
                table: "player_character_achievements");

            migrationBuilder.DropColumn(
                name: "criteria_amounts",
                table: "player_character_achievements");

            migrationBuilder.DropColumn(
                name: "criteria_ids",
                table: "player_character_achievements");
        }
    }
}
