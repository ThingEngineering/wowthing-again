using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserLeaderboardSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_leaderboard_snapshot",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    achievement_points_alliance = table.Column<int>(type: "integer", nullable: false),
                    achievement_points_horde = table.Column<int>(type: "integer", nullable: false),
                    achievement_points_overall = table.Column<int>(type: "integer", nullable: false),
                    appearance_id_count = table.Column<int>(type: "integer", nullable: false),
                    appearance_source_count = table.Column<int>(type: "integer", nullable: false),
                    completed_quest_count = table.Column<int>(type: "integer", nullable: false),
                    heirloom_count = table.Column<short>(type: "smallint", nullable: false),
                    heirloom_levels = table.Column<short>(type: "smallint", nullable: false),
                    illusion_count = table.Column<short>(type: "smallint", nullable: false),
                    mount_count = table.Column<short>(type: "smallint", nullable: false),
                    pet_count = table.Column<short>(type: "smallint", nullable: false),
                    recipe_count = table.Column<short>(type: "smallint", nullable: false),
                    reputation_count = table.Column<short>(type: "smallint", nullable: false),
                    title_count = table.Column<short>(type: "smallint", nullable: false),
                    toy_count = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_leaderboard_snapshot", x => new { x.user_id, x.date });
                    table.ForeignKey(
                        name: "fk_user_leaderboard_snapshot_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_user_leaderboard_snapshot_user_id_date",
                table: "user_leaderboard_snapshot",
                columns: new[] { "user_id", "date" },
                descending: new[] { false, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_leaderboard_snapshot");
        }
    }
}
