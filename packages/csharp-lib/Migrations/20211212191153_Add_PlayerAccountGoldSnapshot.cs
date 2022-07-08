using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccountGoldSnapshot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_account_gold_snapshot",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    realm_id = table.Column<int>(type: "integer", nullable: false),
                    gold = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_gold_snapshot", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_account_gold_snapshot_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_account_gold_snapshot_account_id",
                table: "player_account_gold_snapshot",
                column: "account_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_gold_snapshot");
        }
    }
}
