using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_Mythic_Plus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    current_period_id = table.Column<int>(nullable: false),
                    period_runs = table.Column<List<PlayerCharacterMythicPlusRun>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wow_mythic_plus_season",
                columns: table => new
                {
                    region = table.Column<int>(nullable: false),
                    id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_mythic_plus_season", x => new { x.region, x.id });
                });

            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus_season",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    season = table.Column<int>(nullable: false),
                    runs = table.Column<List<PlayerCharacterMythicPlusRun>>(type: "jsonb", nullable: true),
                    player_character_mythic_plus_character_id = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus_season", x => new { x.character_id, x.season });
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_season_player_character_charac",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_season_player_character_mythic",
                        column: x => x.player_character_mythic_plus_character_id,
                        principalTable: "player_character_mythic_plus",
                        principalColumn: "character_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_character_mythic_plus_season_player_character_mythic",
                table: "player_character_mythic_plus_season",
                column: "player_character_mythic_plus_character_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_mythic_plus_season");

            migrationBuilder.DropTable(
                name: "wow_mythic_plus_season");

            migrationBuilder.DropTable(
                name: "player_character_mythic_plus");
        }
    }
}
