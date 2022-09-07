using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccountAddonData_Honor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "honor_current",
                table: "player_account_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "honor_level",
                table: "player_account_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "honor_max",
                table: "player_account_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "honor_current",
                table: "player_account_addon_data");

            migrationBuilder.DropColumn(
                name: "honor_level",
                table: "player_account_addon_data");

            migrationBuilder.DropColumn(
                name: "honor_max",
                table: "player_account_addon_data");
        }
    }
}
