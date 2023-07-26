using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowAuctionCheapestByAppearanceId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_auction_cheapest_by_appearance_id",
                columns: table => new
                {
                    connected_realm_id = table.Column<int>(type: "integer", nullable: false),
                    appearance_id = table.Column<int>(type: "integer", nullable: false),
                    auction_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction_cheapest_by_appearance_id", x => new { x.connected_realm_id, x.appearance_id });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_auction_cheapest_by_appearance_id");
        }
    }
}
