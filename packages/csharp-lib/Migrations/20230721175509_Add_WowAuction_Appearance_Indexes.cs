using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowAuction_Appearance_Indexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_wow_auction_appearance_id_buyout_price",
                table: "wow_auction",
                columns: new[] { "appearance_id", "buyout_price" },
                filter: "appearance_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_wow_auction_appearance_source_buyout_price",
                table: "wow_auction",
                columns: new[] { "appearance_source", "buyout_price" },
                filter: "appearance_source IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_wow_auction_appearance_id_buyout_price",
                table: "wow_auction");

            migrationBuilder.DropIndex(
                name: "ix_wow_auction_appearance_source_buyout_price",
                table: "wow_auction");
        }
    }
}
