using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterStatistics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_statistics",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    statistic_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    statistic_quantities = table.Column<List<int>>(type: "integer[]", nullable: true),
                    statistic_descriptions = table.Column<List<string>>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_statistics", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_statistics_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_statistics");
        }
    }
}
