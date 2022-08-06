using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonData_MythicPlusSeasons_MythicPlusWeeks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, Dictionary<int, PlayerCharacterAddonDataMythicPlusMap>>>(
                name: "mythic_plus_seasons",
                table: "player_character_addon_data",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<int, List<PlayerCharacterAddonDataMythicPlusRun>>>(
                name: "mythic_plus_weeks",
                table: "player_character_addon_data",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "mythic_plus_seasons",
                table: "player_character_addon_data");

            migrationBuilder.DropColumn(
                name: "mythic_plus_weeks",
                table: "player_character_addon_data");
        }
    }
}
