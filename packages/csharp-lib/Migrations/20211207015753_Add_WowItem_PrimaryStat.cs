using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowItem_PrimaryStat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "primary_stat",
                table: "wow_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "primary_stat",
                table: "wow_item");
        }
    }
}
