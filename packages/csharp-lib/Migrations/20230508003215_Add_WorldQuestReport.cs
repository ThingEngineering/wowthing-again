using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Wowthing.Lib.Models;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WorldQuestReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "world_quest_report",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    zone_id = table.Column<int>(type: "integer", nullable: false),
                    quest_id = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    expansion = table.Column<short>(type: "smallint", nullable: false),
                    faction = table.Column<short>(type: "smallint", nullable: false),
                    @class = table.Column<short>(name: "class", type: "smallint", nullable: false),
                    rewards = table.Column<List<int[]>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_world_quest_report", x => x.id);
                    table.ForeignKey(
                        name: "fk_world_quest_report_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_world_quest_report_region_expires_at",
                table: "world_quest_report",
                columns: new[] { "region", "expires_at" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "ix_world_quest_report_user_id",
                table: "world_quest_report",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "world_quest_report");
        }
    }
}
