using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerGuildItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_guild_item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    guild_id = table.Column<int>(type: "integer", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false),
                    tab_id = table.Column<short>(type: "smallint", nullable: false),
                    slot = table.Column<short>(type: "smallint", nullable: false),
                    context = table.Column<short>(type: "smallint", nullable: false),
                    enchant_id = table.Column<short>(type: "smallint", nullable: false),
                    item_level = table.Column<short>(type: "smallint", nullable: false),
                    quality = table.Column<short>(type: "smallint", nullable: false),
                    suffix_id = table.Column<short>(type: "smallint", nullable: false),
                    gems = table.Column<List<int>>(type: "integer[]", nullable: true),
                    bonus_ids = table.Column<List<short>>(type: "smallint[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_guild_item", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_guild_item_player_guild_guild_id",
                        column: x => x.guild_id,
                        principalTable: "player_guild",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_guild_item_guild_id_item_id",
                table: "player_guild_item",
                columns: new[] { "guild_id", "item_id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_guild_item");
        }
    }
}
