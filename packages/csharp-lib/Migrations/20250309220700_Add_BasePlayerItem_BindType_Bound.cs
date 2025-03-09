using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_BasePlayerItem_BindType_Bound : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "bind_type",
                table: "player_warbank_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<bool>(
                name: "bound",
                table: "player_warbank_item",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<short>(
                name: "bind_type",
                table: "player_guild_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<bool>(
                name: "bound",
                table: "player_guild_item",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<short>(
                name: "bind_type",
                table: "player_character_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<bool>(
                name: "bound",
                table: "player_character_item",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bind_type",
                table: "player_warbank_item");

            migrationBuilder.DropColumn(
                name: "bound",
                table: "player_warbank_item");

            migrationBuilder.DropColumn(
                name: "bind_type",
                table: "player_guild_item");

            migrationBuilder.DropColumn(
                name: "bound",
                table: "player_guild_item");

            migrationBuilder.DropColumn(
                name: "bind_type",
                table: "player_character_item");

            migrationBuilder.DropColumn(
                name: "bound",
                table: "player_character_item");
        }
    }
}
