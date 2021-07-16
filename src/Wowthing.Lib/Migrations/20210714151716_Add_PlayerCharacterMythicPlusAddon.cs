using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterMythicPlusAddon : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "completed_achievements_query",
                columns: table => new
                {
                    achievement_id = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus_addon",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    season = table.Column<int>(type: "integer", nullable: false),
                    maps = table.Column<Dictionary<int, PlayerCharacterMythicPlusAddonMap>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus_addon", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_addon_player_character_charact",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "completed_achievements_query");

            migrationBuilder.DropTable(
                name: "player_character_mythic_plus_addon");
        }
    }
}
