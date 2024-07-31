using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Remove_WowReputationTier_fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "max_values",
                table: "wow_reputation_tier");

            migrationBuilder.DropColumn(
                name: "names",
                table: "wow_reputation_tier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int[]>(
                name: "max_values",
                table: "wow_reputation_tier",
                type: "integer[]",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "names",
                table: "wow_reputation_tier",
                type: "text[]",
                nullable: true);
        }
    }
}
