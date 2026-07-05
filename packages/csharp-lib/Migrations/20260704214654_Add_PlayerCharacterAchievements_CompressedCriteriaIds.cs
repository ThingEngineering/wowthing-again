using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacterAchievements_CompressedCriteriaIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "achievement_ids",
                table: "player_character_achievements");

            migrationBuilder.DropColumn(
                name: "achievement_timestamps",
                table: "player_character_achievements");

            migrationBuilder.AddColumn<byte[]>(
                name: "compressed_criteria_ids",
                table: "player_character_achievements",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "compressed_criteria_ids",
                table: "player_character_achievements");

            migrationBuilder.AddColumn<List<int>>(
                name: "achievement_ids",
                table: "player_character_achievements",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "achievement_timestamps",
                table: "player_character_achievements",
                type: "integer[]",
                nullable: true);
        }
    }
}
