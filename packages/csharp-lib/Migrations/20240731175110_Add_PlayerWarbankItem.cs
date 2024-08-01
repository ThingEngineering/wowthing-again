using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerWarbankItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_warbank_item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false),
                    container_id = table.Column<short>(type: "smallint", nullable: false),
                    slot = table.Column<short>(type: "smallint", nullable: false),
                    context = table.Column<short>(type: "smallint", nullable: false),
                    crafted_quality = table.Column<short>(type: "smallint", nullable: false),
                    enchant_id = table.Column<short>(type: "smallint", nullable: false),
                    item_level = table.Column<short>(type: "smallint", nullable: false),
                    quality = table.Column<short>(type: "smallint", nullable: false),
                    suffix_id = table.Column<short>(type: "smallint", nullable: false),
                    bonus_ids = table.Column<List<short>>(type: "smallint[]", nullable: true),
                    gems = table.Column<List<int>>(type: "integer[]", nullable: true),
                    modifiers = table.Column<Dictionary<int, int>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_warbank_item", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_warbank_item_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_warbank_item_user_id_item_id",
                table: "player_warbank_item",
                columns: new[] { "user_id", "item_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_warbank_item");
        }
    }
}
