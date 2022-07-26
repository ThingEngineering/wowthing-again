using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterAddonData_BindLocation_CurrentLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "bind_location",
                table: "player_character_addon_data",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "current_location",
                table: "player_character_addon_data",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bind_location",
                table: "player_character_addon_data");

            migrationBuilder.DropColumn(
                name: "current_location",
                table: "player_character_addon_data");
        }
    }
}
