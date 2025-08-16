using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class AddWowQuestStuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "area_id",
                table: "wow_quest",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "category_id",
                table: "wow_quest",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<short>(
                name: "maximum_level",
                table: "wow_quest",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "minimum_level",
                table: "wow_quest",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "area_id",
                table: "wow_quest");

            migrationBuilder.DropColumn(
                name: "category_id",
                table: "wow_quest");

            migrationBuilder.DropColumn(
                name: "maximum_level",
                table: "wow_quest");

            migrationBuilder.DropColumn(
                name: "minimum_level",
                table: "wow_quest");
        }
    }
}
