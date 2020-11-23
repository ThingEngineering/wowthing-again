using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCollections : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_collections",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    mounts = table.Column<List<int>>(nullable: true),
                    pets = table.Column<List<int>>(nullable: true),
                    toys = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_collections", x => x.user_id);
                    table.ForeignKey(
                        name: "fk_player_collections_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_collections");
        }
    }
}
