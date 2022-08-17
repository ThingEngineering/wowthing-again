using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowItemModifiedAppearance_Order_SourceType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "order",
                table: "wow_item_modified_appearance",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "source_type",
                table: "wow_item_modified_appearance",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "order",
                table: "wow_item_modified_appearance");

            migrationBuilder.DropColumn(
                name: "source_type",
                table: "wow_item_modified_appearance");
        }
    }
}
