using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Rename_UserAccount_and_UserCharacter_again : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_character");

            migrationBuilder.DropTable(
                name: "user_account");

            migrationBuilder.CreateTable(
                name: "player_account",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false),
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
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
                    class_id = table.Column<int>(nullable: false),
                    experience = table.Column<int>(nullable: false),
                    level = table.Column<int>(nullable: false),
                    race_id = table.Column<int>(nullable: false),
                    realm_id = table.Column<int>(nullable: false),
                    faction = table.Column<int>(nullable: false),
                    gender = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
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

            migrationBuilder.CreateTable(
                name: "user_account",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    region = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_account", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_account_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_character",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false),
                    account_id = table.Column<long>(type: "bigint", nullable: true),
                    active_title_id = table.Column<int>(type: "integer", nullable: false),
                    class_id = table.Column<int>(type: "integer", nullable: false),
                    experience = table.Column<int>(type: "integer", nullable: false),
                    faction = table.Column<int>(type: "integer", nullable: false),
                    gender = table.Column<int>(type: "integer", nullable: false),
                    guild_id = table.Column<long>(type: "bigint", nullable: false),
                    last_modified = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    race_id = table.Column<int>(type: "integer", nullable: false),
                    realm_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_character", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_character_user_account_account_id",
                        column: x => x.account_id,
                        principalTable: "user_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_user_account_user_id",
                table: "user_account",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_character_account_id",
                table: "user_character",
                column: "account_id");
        }
    }
}
