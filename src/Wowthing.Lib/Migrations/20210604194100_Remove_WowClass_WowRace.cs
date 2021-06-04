using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_WowClass_WowRace : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_class");

            migrationBuilder.DropTable(
                name: "wow_race");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_class",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    icon = table.Column<string>(type: "text", nullable: true),
                    name = table.Column<string>(type: "text", nullable: true),
                    specialization_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_class", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_race",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    icon_female = table.Column<string>(type: "text", nullable: true),
                    icon_male = table.Column<string>(type: "text", nullable: true),
                    name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_race", x => x.id);
                });
        }
    }
}
