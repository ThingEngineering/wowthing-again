using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerEquippedItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_equipped_item");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "player_character_equipped_item",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    inventory_slot = table.Column<int>(type: "integer", nullable: false),
                    bonus_ids = table.Column<int[]>(type: "integer[]", nullable: true),
                    context = table.Column<int>(type: "integer", nullable: false),
                    enchantment_ids = table.Column<int[]>(type: "integer[]", nullable: true),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    item_level = table.Column<int>(type: "integer", nullable: false),
                    quality = table.Column<int>(type: "integer", nullable: false)
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
    }
}
