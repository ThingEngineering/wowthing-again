using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_GlobalDailies : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "global_dailies",
                columns: table => new
                {
                    expansion = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<int>(type: "integer", nullable: false),
                    quest_i_ds = table.Column<List<int>>(type: "integer[]", nullable: true),
                    quest_expires = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_global_dailies", x => new { x.expansion, x.region });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "global_dailies");
        }
    }
}
