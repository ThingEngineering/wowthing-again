using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Change_PlayerAccountTransmogSources : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "appearances",
                table: "player_account_transmog_sources");

            migrationBuilder.AddColumn<List<string>>(
                name: "sources",
                table: "player_account_transmog_sources",
                type: "text[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "sources",
                table: "player_account_transmog_sources");

            migrationBuilder.AddColumn<Dictionary<int, List<string>>>(
                name: "appearances",
                table: "player_account_transmog_sources",
                type: "jsonb",
                nullable: true);
        }
    }
}
