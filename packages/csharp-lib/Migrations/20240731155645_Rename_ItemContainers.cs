using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Rename_ItemContainers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "tab_id",
                table: "player_guild_item",
                newName: "container_id");

            migrationBuilder.RenameColumn(
                name: "bag_id",
                table: "player_character_item",
                newName: "container_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "container_id",
                table: "player_guild_item",
                newName: "tab_id");

            migrationBuilder.RenameColumn(
                name: "container_id",
                table: "player_character_item",
                newName: "bag_id");
        }
    }
}
