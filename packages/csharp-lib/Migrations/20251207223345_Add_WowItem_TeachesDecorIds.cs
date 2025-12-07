using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowItem_TeachesDecorIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int[]>(
                name: "teaches_transmog_illusion_ids",
                table: "wow_item",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0],
                oldClrType: typeof(int[]),
                oldType: "integer[]");

            migrationBuilder.AddColumn<int[]>(
                name: "teaches_decor_ids",
                table: "wow_item",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "teaches_decor_ids",
                table: "wow_item");

            migrationBuilder.AlterColumn<int[]>(
                name: "teaches_transmog_illusion_ids",
                table: "wow_item",
                type: "integer[]",
                nullable: false,
                oldClrType: typeof(int[]),
                oldType: "integer[]",
                oldDefaultValue: new int[0]);
        }
    }
}
