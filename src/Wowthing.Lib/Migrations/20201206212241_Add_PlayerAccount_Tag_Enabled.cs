using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccount_Tag_Enabled : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "enabled",
                table: "player_account",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "tag",
                table: "player_account",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "enabled",
                table: "player_account");

            migrationBuilder.DropColumn(
                name: "tag",
                table: "player_account");
        }
    }
}
