using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class AddWowHoliday : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_holiday",
                columns: table => new
                {
                    id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    filtertype = table.Column<short>(name: "filter_type", type: "smallint", nullable: false),
                    flags = table.Column<short>(type: "smallint", nullable: false),
                    looping = table.Column<short>(type: "smallint", nullable: false),
                    priority = table.Column<short>(type: "smallint", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    durations = table.Column<List<short>>(type: "smallint[]", nullable: true),
                    startdates = table.Column<List<DateTime>>(name: "start_dates", type: "timestamp with time zone[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_holiday", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_holiday");
        }
    }
}
