using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonData_Garrisons : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, PlayerCharacterAddonDataGarrison>>(
                name: "garrisons",
                table: "player_character_addon_data",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "garrisons",
                table: "player_character_addon_data");
        }
    }
}
