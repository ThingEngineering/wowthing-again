using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_character_addon_data",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    garrison_trees_scanned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    garrison_trees = table.Column<Dictionary<int, Dictionary<int, List<int>>>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_addon_data", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_addon_data_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character_addon_data");
        }
    }
}
