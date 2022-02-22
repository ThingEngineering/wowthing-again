using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacter_LastApiCheck_Index : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ugh_quests",
                table: "player_character_weekly");

            migrationBuilder.DropColumn(
                name: "ugh_quests_scanned_at",
                table: "player_character_weekly");

            migrationBuilder.CreateIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character",
                column: "last_api_check");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_player_character_last_api_check",
                table: "player_character");

            migrationBuilder.AddColumn<Dictionary<string, PlayerCharacterWeeklyUghQuest>>(
                name: "ugh_quests",
                table: "player_character_weekly",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ugh_quests_scanned_at",
                table: "player_character_weekly",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
