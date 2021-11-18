using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false),
                    location = table.Column<short>(type: "smallint", nullable: false),
                    bag_id = table.Column<short>(type: "smallint", nullable: false),
                    slot = table.Column<short>(type: "smallint", nullable: false),
                    context = table.Column<short>(type: "smallint", nullable: false),
                    enchant_id = table.Column<short>(type: "smallint", nullable: false),
                    item_level = table.Column<short>(type: "smallint", nullable: false),
                    quality = table.Column<short>(type: "smallint", nullable: false),
                    suffix_id = table.Column<short>(type: "smallint", nullable: false),
                    gems = table.Column<List<int>>(type: "integer[]", nullable: true),
                    bonus_ids = table.Column<List<short>>(type: "smallint[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_item", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_character_item_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_character_item_character_id_item_id_location",
                table: "player_character_item",
                columns: new[] { "character_id", "item_id", "location" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_item");
        }
    }
}
