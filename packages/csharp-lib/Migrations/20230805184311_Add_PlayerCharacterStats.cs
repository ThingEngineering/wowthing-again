using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacterStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_stats",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    basic = table.Column<Dictionary<WowItemStatType, PlayerCharacterStatsBasic>>(type: "jsonb", nullable: true),
                    misc = table.Column<Dictionary<WowItemStatType, int>>(type: "jsonb", nullable: true),
                    rating = table.Column<Dictionary<WowItemStatType, PlayerCharacterStatsRating>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_stats", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_stats_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_stats");
        }
    }
}
