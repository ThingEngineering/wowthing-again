using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Remove_PlayerCollections : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "character_query");

            migrationBuilder.DropTable(
                name: "player_collections");

            migrationBuilder.CreateTable(
                name: "scheduler_character_query",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    realm_slug = table.Column<string>(nullable: true),
                    character_id = table.Column<long>(nullable: false),
                    character_delay_hours = table.Column<int>(nullable: false),
                    character_faction = table.Column<int>(nullable: false),
                    character_level = table.Column<int>(nullable: false),
                    character_name = table.Column<string>(nullable: true),
                    last_modified = table.Column<DateTime>(nullable: false),
                    last_api_check = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "scheduler_character_query");

            migrationBuilder.CreateTable(
                name: "character_query",
                columns: table => new
                {
                    character_id = table.Column<long>(type: "bigint", nullable: false),
                    character_level = table.Column<int>(type: "integer", nullable: false),
                    character_name = table.Column<string>(type: "text", nullable: true),
                    last_api_check = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    last_modified = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    realm_slug = table.Column<string>(type: "text", nullable: true),
                    region = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "player_collections",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    mounts = table.Column<List<int>>(type: "integer[]", nullable: true),
                    pets = table.Column<List<int>>(type: "integer[]", nullable: true),
                    toys = table.Column<List<int>>(type: "integer[]", nullable: true)
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
    }
}
