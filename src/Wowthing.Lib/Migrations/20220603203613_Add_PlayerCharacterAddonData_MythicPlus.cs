using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonData_MythicPlus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, PlayerCharacterAddonDataMythicPlus>>(
                name: "mythic_plus",
                table: "player_character_addon_data",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "mythic_plus_scanned_at",
                table: "player_character_addon_data",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "mythic_plus",
                table: "player_character_addon_data");

            migrationBuilder.DropColumn(
                name: "mythic_plus_scanned_at",
                table: "player_character_addon_data");
        }
    }
}
