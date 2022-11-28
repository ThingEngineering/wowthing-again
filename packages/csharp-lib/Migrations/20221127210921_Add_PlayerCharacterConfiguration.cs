using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerCharacterConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_configuration",
                columns: table => new
                {
                    characterid = table.Column<int>(name: "character_id", type: "integer", nullable: false),
                    backgroundid = table.Column<short>(name: "background_id", type: "smallint", nullable: false),
                    backgroundbrightness = table.Column<short>(name: "background_brightness", type: "smallint", nullable: false),
                    backgroundsaturation = table.Column<short>(name: "background_saturation", type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_configuration", x => x.characterid);
                    table.ForeignKey(
                        name: "fk_player_character_configuration_player_character_character_id",
                        column: x => x.characterid,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_configuration");
        }
    }
}
