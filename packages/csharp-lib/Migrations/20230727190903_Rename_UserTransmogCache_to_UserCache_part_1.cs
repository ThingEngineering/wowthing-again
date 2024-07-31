using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Rename_UserTransmogCache_to_UserCache_part_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_user_transmog_cache_application_user_user_id",
                table: "user_transmog_cache");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_transmog_cache",
                table: "user_transmog_cache");

            migrationBuilder.RenameTable(
                name: "user_transmog_cache",
                newName: "user_cache");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_cache",
                table: "user_cache",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_user_cache_asp_net_users_user_id",
                table: "user_cache",
                column: "user_id",
                principalTable: "asp_net_users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_user_cache_asp_net_users_user_id",
                table: "user_cache");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_cache",
                table: "user_cache");

            migrationBuilder.RenameTable(
                name: "user_cache",
                newName: "user_transmog_cache");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_transmog_cache",
                table: "user_transmog_cache",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_user_transmog_cache_application_user_user_id",
                table: "user_transmog_cache",
                column: "user_id",
                principalTable: "asp_net_users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
