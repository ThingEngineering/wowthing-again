using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_Query_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "achievement_criteria_query");

            migrationBuilder.DropTable(
                name: "completed_achievements_query");

            migrationBuilder.DropTable(
                name: "scheduler_character_query");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "achievement_criteria_query",
                columns: table => new
                {
                    amount = table.Column<long>(type: "bigint", nullable: false),
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    criteria_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "completed_achievements_query",
                columns: table => new
                {
                    achievement_id = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "scheduler_character_query",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: true),
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    character_name = table.Column<string>(type: "text", nullable: true),
                    realm_slug = table.Column<string>(type: "text", nullable: true),
                    region = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                });
        }
    }
}
