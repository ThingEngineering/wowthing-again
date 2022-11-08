﻿using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerCharacterAddonDataCurrencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<int, PlayerCharacterAddonDataCurrency>>(
                name: "currencies",
                table: "player_character_addon_data",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "currencies",
                table: "player_character_addon_data");
        }
    }
}
