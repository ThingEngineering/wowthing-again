using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonQuests_Dailies : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, List<List<int>>>>(
                name: "dailies",
                table: "player_character_addon_quests",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dailies",
                table: "player_character_addon_quests");
        }
    }
}
