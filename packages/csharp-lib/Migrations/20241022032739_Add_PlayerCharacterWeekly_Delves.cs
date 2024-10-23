using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacterWeekly_Delves : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "delve_levels",
                table: "player_character_weekly",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "delve_maps",
                table: "player_character_weekly",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "delve_week",
                table: "player_character_weekly",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "delve_levels",
                table: "player_character_weekly");

            migrationBuilder.DropColumn(
                name: "delve_maps",
                table: "player_character_weekly");

            migrationBuilder.DropColumn(
                name: "delve_week",
                table: "player_character_weekly");
        }
    }
}
