using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowAuction_Indexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_wow_auction_item_id",
                table: "wow_auction",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "ix_wow_auction_pet_species_id",
                table: "wow_auction",
                column: "pet_species_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_wow_auction_item_id",
                table: "wow_auction");

            migrationBuilder.DropIndex(
                name: "ix_wow_auction_pet_species_id",
                table: "wow_auction");
        }
    }
}
