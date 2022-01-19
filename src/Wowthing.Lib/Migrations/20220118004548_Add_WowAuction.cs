using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowAuction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
@"
CREATE TABLE wow_auction (
    connected_realm_id integer NOT NULL,
    auction_id integer NOT NULL,
    bid_price bigint NOT NULL,
    buyout_price bigint NOT NULL,
    item_id integer NOT NULL,
    quantity integer NOT NULL,
    time_left smallint NOT NULL,
    context smallint NOT NULL,
    pet_breed_id smallint NOT NULL,
    pet_level smallint NOT NULL,
    pet_quality smallint NOT NULL,
    pet_species_id smallint NOT NULL,
    bonus_ids integer[] NULL,
    modifier_values integer[] NULL,
    modifier_types smallint[] NULL,
    CONSTRAINT pk_wow_auction PRIMARY KEY (connected_realm_id, auction_id)
) PARTITION BY LIST (connected_realm_id)
");

            /*migrationBuilder.CreateTable(
                name: "wow_auction",
                columns: table => new
                {
                    connected_realm_id = table.Column<int>(type: "integer", nullable: false),
                    auction_id = table.Column<int>(type: "integer", nullable: false),
                    bid_price = table.Column<long>(type: "bigint", nullable: false),
                    buyout_price = table.Column<long>(type: "bigint", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    time_left = table.Column<short>(type: "smallint", nullable: false),
                    context = table.Column<short>(type: "smallint", nullable: false),
                    pet_breed_id = table.Column<short>(type: "smallint", nullable: false),
                    pet_level = table.Column<short>(type: "smallint", nullable: false),
                    pet_quality = table.Column<short>(type: "smallint", nullable: false),
                    pet_species_id = table.Column<short>(type: "smallint", nullable: false),
                    bonus_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    modifier_values = table.Column<List<int>>(type: "integer[]", nullable: true),
                    modifier_types = table.Column<List<short>>(type: "smallint[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_auction", x => new { x.connected_realm_id, x.auction_id });
                });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_auction");
        }
    }
}
