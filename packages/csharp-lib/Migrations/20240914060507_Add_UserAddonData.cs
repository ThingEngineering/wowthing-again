using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserAddonData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_addon_data",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    warbank_updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    warbank_copper = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_addon_data", x => x.user_id);
                    table.ForeignKey(
                        name: "fk_user_addon_data_application_user_user_id",
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
                name: "user_addon_data");
        }
    }
}
