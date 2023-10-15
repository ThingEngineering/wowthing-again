using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowWorldQuest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_world_quest",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    expansion = table.Column<short>(type: "smallint", nullable: false),
                    max_level = table.Column<short>(type: "smallint", nullable: false),
                    min_level = table.Column<short>(type: "smallint", nullable: false),
                    quest_info_id = table.Column<short>(type: "smallint", nullable: false),
                    need_quest_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    skip_quest_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_world_quest", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_world_quest");
        }
    }
}
