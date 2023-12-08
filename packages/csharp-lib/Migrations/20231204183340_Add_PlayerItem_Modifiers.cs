using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_PlayerItem_Modifiers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, int>>(
                name: "modifiers",
                table: "player_guild_item",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<int, int>>(
                name: "modifiers",
                table: "player_character_item",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "modifiers",
                table: "player_guild_item");

            migrationBuilder.DropColumn(
                name: "modifiers",
                table: "player_character_item");
        }
    }
}
