using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerCharacterItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_items");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_items",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    items = table.Column<List<PlayerCharacterItem>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_items", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_items_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
