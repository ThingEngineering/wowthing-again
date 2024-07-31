using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacterAddonQuests_CompletedQuests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "completed_quests",
                table: "player_character_addon_quests",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "completed_quests_scanned_at",
                table: "player_character_addon_quests",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "completed_quests",
                table: "player_character_addon_quests");

            migrationBuilder.DropColumn(
                name: "completed_quests_scanned_at",
                table: "player_character_addon_quests");
        }
    }
}
