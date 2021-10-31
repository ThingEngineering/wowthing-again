using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAchievements_CriteriaCompleted : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<bool>>(
                name: "criteria_completed",
                table: "player_character_achievements",
                type: "boolean[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "criteria_completed",
                table: "player_character_achievements");
        }
    }
}
