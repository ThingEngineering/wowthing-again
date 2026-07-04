using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerAccountAchievements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_account_achievements",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    compressed_achievement_ids = table.Column<byte[]>(type: "bytea", nullable: true),
                    achievement_timestamps = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_achievements", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_achievements_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_achievements");
        }
    }
}
