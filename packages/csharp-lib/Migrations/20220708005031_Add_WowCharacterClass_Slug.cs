using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowCharacterClass_Slug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "slug",
                table: "wow_character_class",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "slug",
                table: "wow_character_class");
        }
    }
}
