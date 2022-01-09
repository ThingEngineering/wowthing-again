using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonQuests_CallingsScannedAt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "scanned_at",
                table: "player_character_addon_quests",
                newName: "quests_scanned_at");

            migrationBuilder.AddColumn<DateTime>(
                name: "callings_scanned_at",
                table: "player_character_addon_quests",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "callings_scanned_at",
                table: "player_character_addon_quests");

            migrationBuilder.RenameColumn(
                name: "quests_scanned_at",
                table: "player_character_addon_quests",
                newName: "scanned_at");
        }
    }
}
