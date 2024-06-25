using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Player;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserBulkData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_bulk_data",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    heirlooms_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    mounts_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    pets_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    toys_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    transmogs_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    transmog_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    mount_ids = table.Column<List<short>>(type: "smallint[]", nullable: true),
                    toy_ids = table.Column<List<short>>(type: "smallint[]", nullable: true),
                    heirlooms = table.Column<Dictionary<int, int>>(type: "jsonb", nullable: true),
                    pets = table.Column<Dictionary<long, PlayerAccountPetsPet>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_bulk_data", x => x.user_id);
                    table.ForeignKey(
                        name: "fk_user_bulk_data_application_user_user_id",
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
                name: "user_bulk_data");
        }
    }
}
