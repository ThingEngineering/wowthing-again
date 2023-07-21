using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowAuction_AppearanceId_AppearanceSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "appearance_id",
                table: "wow_auction",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "appearance_source",
                table: "wow_auction",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "appearance_id",
                table: "wow_auction");

            migrationBuilder.DropColumn(
                name: "appearance_source",
                table: "wow_auction");
        }
    }
}
