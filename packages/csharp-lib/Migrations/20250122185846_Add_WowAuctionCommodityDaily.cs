using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowAuctionCommodityDaily : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_auction_commodity_daily",
                columns: table => new
                {
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<short>(type: "smallint", nullable: false),
                    listed_min = table.Column<int>(type: "integer", nullable: false),
                    listed_max = table.Column<int>(type: "integer", nullable: false),
                    avg_data = table.Column<List<int>>(type: "integer[]", nullable: true),
                    max_data = table.Column<List<int>>(type: "integer[]", nullable: true),
                    min_data = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction_commodity_daily", x => new { x.region, x.item_id, x.date });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_auction_commodity_daily");
        }
    }
}
