using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterSpecializations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_specializations",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    specializations = table.Column<Dictionary<int, PlayerCharacterSpecializationsSpecialization>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_specializations", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_specializations_player_character_character",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_specializations");
        }
    }
}
