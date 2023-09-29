using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerCharacter_ShouldUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "delay_hours",
                table: "player_character");

            migrationBuilder.AddColumn<bool>(
                name: "should_update",
                table: "player_character",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "should_update",
                table: "player_character");

            migrationBuilder.AddColumn<int>(
                name: "delay_hours",
                table: "player_character",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
