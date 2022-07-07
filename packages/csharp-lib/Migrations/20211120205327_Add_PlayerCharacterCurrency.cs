using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterCurrency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_currency",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    currency_id = table.Column<short>(type: "smallint", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    max = table.Column<int>(type: "integer", nullable: false),
                    week_quantity = table.Column<int>(type: "integer", nullable: false),
                    week_max = table.Column<int>(type: "integer", nullable: false),
                    total_quantity = table.Column<int>(type: "integer", nullable: false),
                    is_weekly = table.Column<bool>(type: "boolean", nullable: false),
                    is_moving_max = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_currency", x => new { x.character_id, x.currency_id });
                    table.ForeignKey(
                        name: "fk_player_character_currency_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_character_currency_character_id_currency_id",
                table: "player_character_currency",
                columns: new[] { "character_id", "currency_id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_currency");
        }
    }
}
