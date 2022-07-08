using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterMedia : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_media",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    avatar_url = table.Column<string>(type: "text", nullable: true),
                    inset_url = table.Column<string>(type: "text", nullable: true),
                    main_url = table.Column<string>(type: "text", nullable: true),
                    main_raw_url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_media", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_media_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_media");
        }
    }
}
