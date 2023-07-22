using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserTransmogCache : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_transmog_cache",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    appearance_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    appearance_sources = table.Column<List<string>>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_transmog_cache", x => x.user_id);
                    table.ForeignKey(
                        name: "fk_user_transmog_cache_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_transmog_cache");
        }
    }
}
