﻿using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_PlayerAccountTransmogSources : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "player_account_transmog_sources",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    appearances = table.Column<Dictionary<int, List<string>>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_transmog_sources", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_transmog_sources_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player_account_transmog_sources");
        }
    }
}
