using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterReputations_ExtraReputation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "extra_reputation_ids",
                table: "player_character_reputations",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "extra_reputation_values",
                table: "player_character_reputations",
                type: "integer[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "extra_reputation_ids",
                table: "player_character_reputations");

            migrationBuilder.DropColumn(
                name: "extra_reputation_values",
                table: "player_character_reputations");
        }
    }
}
