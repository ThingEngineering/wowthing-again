using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_MiscAggregate_MiscReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "misc_aggregate",
                columns: table => new
                {
                    report_type = table.Column<short>(type: "smallint", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    json_data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_misc_aggregate", x => new { x.region, x.report_type });
                });

            migrationBuilder.CreateTable(
                name: "misc_report",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reported_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    report_type = table.Column<short>(type: "smallint", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    data = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_misc_report", x => x.id);
                    table.ForeignKey(
                        name: "fk_misc_report_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_misc_report_report_type_region_expires_at",
                table: "misc_report",
                columns: new[] { "report_type", "region", "expires_at" },
                descending: new[] { false, false, true });

            migrationBuilder.CreateIndex(
                name: "ix_misc_report_user_id",
                table: "misc_report",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "misc_aggregate");

            migrationBuilder.DropTable(
                name: "misc_report");
        }
    }
}
