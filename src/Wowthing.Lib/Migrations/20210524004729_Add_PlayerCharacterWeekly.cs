using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterWeekly : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_weekly",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    keystone_dungeon = table.Column<int>(type: "integer", nullable: false),
                    keystone_level = table.Column<int>(type: "integer", nullable: false),
                    vault = table.Column<PlayerCharacterWeeklyVault>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_weekly", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_weekly_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_weekly");
        }
    }
}
