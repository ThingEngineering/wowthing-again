using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacter_AverageItemLevel_and_EquippedItemLevel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "average_item_level",
                table: "player_character",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "equipped_item_level",
                table: "player_character",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "character_query",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    realm_slug = table.Column<string>(nullable: true),
                    character_id = table.Column<long>(nullable: false),
                    character_name = table.Column<string>(nullable: true),
                    character_level = table.Column<int>(nullable: false),
                    last_modified = table.Column<DateTime>(nullable: false),
                    last_api_check = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "character_query");

            migrationBuilder.DropColumn(
                name: "average_item_level",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "equipped_item_level",
                table: "player_character");
        }
    }
}
