using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowChallengeDungeon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_challenge_dungeon",
                columns: table => new
                {
                    id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    expansion = table.Column<short>(type: "smallint", nullable: false),
                    map_id = table.Column<short>(type: "smallint", nullable: false),
                    timer_breakpoints = table.Column<List<short>>(type: "smallint[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_challenge_dungeon", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_challenge_dungeon");
        }
    }
}
