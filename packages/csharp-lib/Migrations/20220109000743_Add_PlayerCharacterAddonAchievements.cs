using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonAchievements : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_addon_achievements",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    achievements = table.Column<Dictionary<int, PlayerCharacterAddonAchievementsAchievement>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_addon_achievements", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_addon_achievements_player_character_charac",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_addon_achievements");
        }
    }
}
