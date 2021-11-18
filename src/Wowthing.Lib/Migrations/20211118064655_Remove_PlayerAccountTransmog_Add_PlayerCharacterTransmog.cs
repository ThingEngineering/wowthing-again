using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerAccountTransmog_Add_PlayerCharacterTransmog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_transmog");

            migrationBuilder.CreateTable(
                name: "player_character_transmog",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    transmog_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_transmog", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_transmog_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_transmog");

            migrationBuilder.CreateTable(
                name: "player_account_transmog",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    transmog_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_transmog", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_transmog_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
