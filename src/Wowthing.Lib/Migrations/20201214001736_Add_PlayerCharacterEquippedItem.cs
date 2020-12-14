using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterEquippedItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "character_id",
                table: "scheduler_character_query",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateTable(
                name: "player_character_equipped_item",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    inventory_slot = table.Column<int>(nullable: false),
                    context = table.Column<int>(nullable: false),
                    item_id = table.Column<int>(nullable: false),
                    item_level = table.Column<int>(nullable: false),
                    quality = table.Column<int>(nullable: false),
                    bonus_ids = table.Column<List<int>>(nullable: true),
                    enchantment_ids = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_equipped_item", x => new { x.character_id, x.inventory_slot });
                    table.ForeignKey(
                        name: "fk_player_character_equipped_item_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_equipped_item");

            migrationBuilder.AlterColumn<long>(
                name: "character_id",
                table: "scheduler_character_query",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int));
        }
    }
}
