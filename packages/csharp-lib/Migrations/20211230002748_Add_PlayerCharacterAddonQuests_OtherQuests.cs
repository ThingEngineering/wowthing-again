using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonQuests_OtherQuests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "other_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "other_quests",
                table: "player_character_addon_quests");
        }
    }
}
