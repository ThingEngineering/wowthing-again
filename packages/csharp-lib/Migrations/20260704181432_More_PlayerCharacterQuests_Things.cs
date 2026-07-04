using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class More_PlayerCharacterQuests_Things : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "daily_quests",
                table: "player_character_addon_quests");

            migrationBuilder.DropColumn(
                name: "other_quests",
                table: "player_character_addon_quests");

            migrationBuilder.AddColumn<DateTime>(
                name: "scanned_at",
                table: "player_character_quests",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<byte[]>(
                name: "compressed_completed_ids",
                table: "player_character_addon_quests",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "scanned_at",
                table: "player_character_quests");

            migrationBuilder.DropColumn(
                name: "compressed_completed_ids",
                table: "player_character_addon_quests");

            migrationBuilder.AddColumn<List<int>>(
                name: "daily_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "other_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);
        }
    }
}
