using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccountAddonData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_account_addon_data",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    heirlooms = table.Column<Dictionary<int, short>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_addon_data", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_addon_data_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_addon_data");
        }
    }
}
