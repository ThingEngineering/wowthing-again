using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterWeekly_UghQuests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<string, PlayerCharacterWeeklyUghQuest>>(
                name: "ugh_quests",
                table: "player_character_weekly",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ugh_quests",
                table: "player_character_weekly");
        }
    }
}
