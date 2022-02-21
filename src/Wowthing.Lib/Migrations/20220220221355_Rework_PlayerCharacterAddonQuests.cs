using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Rework_PlayerCharacterAddonQuests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "other_quests",
                table: "player_character_addon_quests");

            migrationBuilder.DropColumn(
                name: "weekly_quests",
                table: "player_character_addon_quests");

            migrationBuilder.AddColumn<Dictionary<string, PlayerCharacterAddonQuestsProgress>>(
                name: "progress_quests",
                table: "player_character_addon_quests",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "progress_quests",
                table: "player_character_addon_quests");

            migrationBuilder.AddColumn<List<int>>(
                name: "other_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "weekly_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);
        }
    }
}
