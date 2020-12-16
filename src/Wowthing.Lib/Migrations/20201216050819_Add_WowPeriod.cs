using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowPeriod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_period",
                columns: table => new
                {
                    region = table.Column<int>(nullable: false),
                    id = table.Column<int>(nullable: false),
                    starts = table.Column<DateTime>(nullable: false),
                    ends = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_period", x => new { x.region, x.id });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_period");
        }
    }
}
