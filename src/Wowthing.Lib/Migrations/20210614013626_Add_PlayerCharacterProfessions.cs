using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterProfessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_professions",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    professions = table.Column<Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_professions", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_professions_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_professions");
        }
    }
}
