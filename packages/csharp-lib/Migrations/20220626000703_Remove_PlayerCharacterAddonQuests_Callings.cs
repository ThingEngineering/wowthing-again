using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerCharacterAddonQuests_Callings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "calling_completed",
                table: "player_character_addon_quests");

            migrationBuilder.DropColumn(
                name: "calling_expires",
                table: "player_character_addon_quests");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<bool>>(
                name: "calling_completed",
                table: "player_character_addon_quests",
                type: "boolean[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "calling_expires",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);
        }
    }
}
