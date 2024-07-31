using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserCache_fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<short>>(
                name: "illusion_ids",
                table: "user_cache",
                type: "smallint[]",
                nullable: true);

            migrationBuilder.AddColumn<List<short>>(
                name: "mount_ids",
                table: "user_cache",
                type: "smallint[]",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "mounts_updated",
                table: "user_cache",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "transmog_updated",
                table: "user_cache",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "illusion_ids",
                table: "user_cache");

            migrationBuilder.DropColumn(
                name: "mount_ids",
                table: "user_cache");

            migrationBuilder.DropColumn(
                name: "mounts_updated",
                table: "user_cache");

            migrationBuilder.DropColumn(
                name: "transmog_updated",
                table: "user_cache");
        }
    }
}
