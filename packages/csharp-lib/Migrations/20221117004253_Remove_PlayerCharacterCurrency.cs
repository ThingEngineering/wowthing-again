using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class RemovePlayerCharacterCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_currency");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_currency",
                columns: table => new
                {
                    characterid = table.Column<int>(name: "character_id", type: "integer", nullable: false),
                    currencyid = table.Column<short>(name: "currency_id", type: "smallint", nullable: false),
                    ismovingmax = table.Column<bool>(name: "is_moving_max", type: "boolean", nullable: false),
                    isweekly = table.Column<bool>(name: "is_weekly", type: "boolean", nullable: false),
                    max = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    totalquantity = table.Column<int>(name: "total_quantity", type: "integer", nullable: false),
                    weekmax = table.Column<int>(name: "week_max", type: "integer", nullable: false),
                    weekquantity = table.Column<int>(name: "week_quantity", type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_currency", x => new { x.characterid, x.currencyid });
                    table.ForeignKey(
                        name: "fk_player_character_currency_player_character_character_id",
                        column: x => x.characterid,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_character_currency_character_id_currency_id",
                table: "player_character_currency",
                columns: new[] { "character_id", "currency_id" });
        }
    }
}
