using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerCharacterShadowlands_Covenants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, PlayerCharacterShadowlandsCovenant>>(
                name: "covenants",
                table: "player_character_shadowlands",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "covenants",
                table: "player_character_shadowlands");
        }
    }
}
