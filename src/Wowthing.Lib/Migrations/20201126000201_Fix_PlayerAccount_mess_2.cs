using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Fix_PlayerAccount_mess_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_account",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    account_id = table.Column<long>(nullable: false),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_account_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false),
                    account_id = table.Column<long>(nullable: true),
                    guild_id = table.Column<long>(nullable: false),
                    active_title_id = table.Column<int>(nullable: false),
                    average_item_level = table.Column<int>(nullable: false),
                    class_id = table.Column<int>(nullable: false),
                    equipped_item_level = table.Column<int>(nullable: false),
                    experience = table.Column<int>(nullable: false),
                    level = table.Column<int>(nullable: false),
                    race_id = table.Column<int>(nullable: false),
                    realm_id = table.Column<int>(nullable: false),
                    faction = table.Column<int>(nullable: false),
                    gender = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    delay_hours = table.Column<int>(nullable: false),
                    last_api_check = table.Column<DateTime>(nullable: false),
                    last_modified = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_character_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_account_user_id",
                table: "player_account",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_player_account_region_account_id",
                table: "player_account",
                columns: new[] { "region", "account_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_player_character_account_id",
                table: "player_character",
                column: "account_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_character");

            migrationBuilder.DropTable(
                name: "player_account");
        }
    }
}
