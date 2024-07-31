using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserCache_Toys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<short>>(
                name: "toy_ids",
                table: "user_cache",
                type: "smallint[]",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "toys_updated",
                table: "user_cache",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "toy_ids",
                table: "user_cache");

            migrationBuilder.DropColumn(
                name: "toys_updated",
                table: "user_cache");
        }
    }
}
