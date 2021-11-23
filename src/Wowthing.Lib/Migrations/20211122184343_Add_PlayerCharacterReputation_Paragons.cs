using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterReputation_Paragons : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, PlayerCharacterReputationsParagon>>(
                name: "paragons",
                table: "player_character_reputations",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "paragons",
                table: "player_character_reputations");
        }
    }
}
