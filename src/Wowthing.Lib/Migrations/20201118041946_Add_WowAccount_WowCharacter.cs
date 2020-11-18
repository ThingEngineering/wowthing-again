using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowAccount_WowCharacter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_account",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false),
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_account", x => x.id);
                    table.ForeignKey(
                        name: "fk_wow_account_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wow_character",
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
                    gender = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    last_modified = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_character", x => x.id);
                    table.ForeignKey(
                        name: "fk_wow_character_wow_account_account_id",
                        column: x => x.account_id,
                        principalTable: "wow_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_wow_account_user_id",
                table: "wow_account",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_wow_character_account_id",
                table: "wow_character",
                column: "account_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_character");

            migrationBuilder.DropTable(
                name: "wow_account");
        }
    }
}
