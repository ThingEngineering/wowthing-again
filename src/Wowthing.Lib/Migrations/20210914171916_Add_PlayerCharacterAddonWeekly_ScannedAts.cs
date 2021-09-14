using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonWeekly_ScannedAts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "keystone_scanned_at",
                table: "player_character_weekly",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "torghast_scanned_at",
                table: "player_character_weekly",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ugh_quests_scanned_at",
                table: "player_character_weekly",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "keystone_scanned_at",
                table: "player_character_weekly");

            migrationBuilder.DropColumn(
                name: "torghast_scanned_at",
                table: "player_character_weekly");

            migrationBuilder.DropColumn(
                name: "ugh_quests_scanned_at",
                table: "player_character_weekly");
        }
    }
}
