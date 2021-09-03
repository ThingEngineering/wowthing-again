using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccountPets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "account_id",
                table: "scheduler_character_query",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "player_account_pets",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    pets = table.Column<Dictionary<long, PlayerAccountPetsPet>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_pets", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_pets_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_pets");

            migrationBuilder.DropColumn(
                name: "account_id",
                table: "scheduler_character_query");
        }
    }
}
