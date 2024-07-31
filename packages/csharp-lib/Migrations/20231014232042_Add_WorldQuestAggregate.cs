using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WorldQuestAggregate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "world_quest_aggregate",
                columns: table => new
                {
                    zone_id = table.Column<int>(type: "integer", nullable: false),
                    quest_id = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    json_data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_world_quest_aggregate", x => new { x.region, x.zone_id, x.quest_id });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "world_quest_aggregate");
        }
    }
}
