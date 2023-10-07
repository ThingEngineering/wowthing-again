using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Remove_WowAuctionCommodity_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_auction_commodity_daily");

            migrationBuilder.DropTable(
                name: "wow_auction_commodity_hourly");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_auction_commodity_daily",
                columns: table => new
                {
                    region = table.Column<short>(type: "smallint", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    average10000max = table.Column<int>(type: "integer", nullable: false),
                    average10000min = table.Column<int>(type: "integer", nullable: false),
                    average1000max = table.Column<int>(type: "integer", nullable: false),
                    average1000min = table.Column<int>(type: "integer", nullable: false),
                    average100max = table.Column<int>(type: "integer", nullable: false),
                    average100min = table.Column<int>(type: "integer", nullable: false),
                    average10max = table.Column<int>(type: "integer", nullable: false),
                    average10min = table.Column<int>(type: "integer", nullable: false),
                    listed_max = table.Column<int>(type: "integer", nullable: false),
                    listed_min = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction_commodity_daily", x => new { x.region, x.item_id, x.date });
                });

            migrationBuilder.CreateTable(
                name: "wow_auction_commodity_hourly",
                columns: table => new
                {
                    region = table.Column<short>(type: "smallint", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    average10 = table.Column<int>(type: "integer", nullable: false),
                    average100 = table.Column<int>(type: "integer", nullable: false),
                    average1000 = table.Column<int>(type: "integer", nullable: false),
                    average10000 = table.Column<int>(type: "integer", nullable: false),
                    listed = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction_commodity_hourly", x => new { x.region, x.item_id, x.timestamp });
                });
        }
    }
}
