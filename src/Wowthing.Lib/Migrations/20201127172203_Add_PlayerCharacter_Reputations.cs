using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacter_Reputations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<int>>(
                name: "reputation_ids",
                table: "player_character",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "reputation_values",
                table: "player_character",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reputation_ids",
                table: "player_character");

            migrationBuilder.DropColumn(
                name: "reputation_values",
                table: "player_character");
        }
    }
}
