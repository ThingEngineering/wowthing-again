using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerEquippedItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_equipped_items",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    items = table.Column<Dictionary<WowInventorySlot, PlayerCharacterEquippedItem>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_equipped_items", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_equipped_items_player_character_character_",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_equipped_items");
        }
    }
}
