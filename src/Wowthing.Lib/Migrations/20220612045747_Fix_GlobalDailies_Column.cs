using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Fix_GlobalDailies_Column : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "quest_i_ds",
                table: "global_dailies",
                newName: "quest_ids");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "quest_ids",
                table: "global_dailies",
                newName: "quest_i_ds");
        }
    }
}
