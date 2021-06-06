using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacter_Fields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "chromie_time",
                table: "player_character",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "is_resting",
                table: "player_character",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_war_mode",
                table: "player_character",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "mount_skill",
                table: "player_character",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "chromie_time",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "is_resting",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "is_war_mode",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "mount_skill",
                table: "player_character");
        }
    }
}
