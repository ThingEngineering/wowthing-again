using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowReputationTier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_reputation_tier",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    min_values = table.Column<int[]>(nullable: true),
                    max_values = table.Column<int[]>(nullable: true),
                    names = table.Column<string[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_reputation_tier", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_reputation_tier");
        }
    }
}
