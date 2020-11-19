using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_ApplicationUser_Settings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<ApplicationUserSettings>(
                name: "settings",
                table: "asp_net_users",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "settings",
                table: "asp_net_users");
        }
    }
}
