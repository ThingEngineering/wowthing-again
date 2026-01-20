using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRemixColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "remix_artifact_trait",
                table: "player_character_addon_data");

            migrationBuilder.DropColumn(
                name: "remix_research_have",
                table: "player_character_addon_data");

            migrationBuilder.DropColumn(
                name: "remix_research_total",
                table: "player_character_addon_data");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "remix_artifact_trait",
                table: "player_character_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "remix_research_have",
                table: "player_character_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "remix_research_total",
                table: "player_character_addon_data",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }
    }
}
