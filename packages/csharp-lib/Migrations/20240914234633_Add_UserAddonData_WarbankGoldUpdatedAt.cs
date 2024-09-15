using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserAddonData_WarbankGoldUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "warbank_gold_updated_at",
                table: "user_addon_data",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "warbank_gold_updated_at",
                table: "user_addon_data");
        }
    }
}
