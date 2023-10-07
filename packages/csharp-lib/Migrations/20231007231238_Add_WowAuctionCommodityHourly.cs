using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowAuctionCommodityHourly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_auction_commodity_hourly",
                columns: table => new
                {
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    listed = table.Column<int>(type: "integer", nullable: false),
                    data = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction_commodity_hourly", x => new { x.region, x.item_id, x.timestamp });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_auction_commodity_hourly");
        }
    }
}
