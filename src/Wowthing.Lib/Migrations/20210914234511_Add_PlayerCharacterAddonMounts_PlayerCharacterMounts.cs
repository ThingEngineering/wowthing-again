using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonMounts_PlayerCharacterMounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_addon_mounts",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    mounts = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_addon_mounts", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_addon_mounts_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_mounts",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    mounts = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mounts", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mounts_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_addon_mounts");

            migrationBuilder.DropTable(
                name: "player_character_mounts");
        }
    }
}
