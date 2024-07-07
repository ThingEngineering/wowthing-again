using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_QueuedJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "queued_job",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    priority = table.Column<short>(type: "smallint", nullable: false),
                    type = table.Column<short>(type: "smallint", nullable: false),
                    data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_queued_job", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_queued_job_priority",
                table: "queued_job",
                column: "priority",
                filter: "started_at IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "queued_job");
        }
    }
}
