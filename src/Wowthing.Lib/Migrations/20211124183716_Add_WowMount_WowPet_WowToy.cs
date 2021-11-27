using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowMount_WowPet_WowToy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wow_mount",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    spell_id = table.Column<int>(type: "integer", nullable: false),
                    flags = table.Column<int>(type: "integer", nullable: false),
                    source_type = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_mount", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_pet",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    creature_id = table.Column<int>(type: "integer", nullable: false),
                    spell_id = table.Column<int>(type: "integer", nullable: false),
                    flags = table.Column<int>(type: "integer", nullable: false),
                    pet_type = table.Column<short>(type: "smallint", nullable: false),
                    source_type = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_pet", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_toy",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    flags = table.Column<int>(type: "integer", nullable: false),
                    source_type = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_toy", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_mount");

            migrationBuilder.DropTable(
                name: "wow_pet");

            migrationBuilder.DropTable(
                name: "wow_toy");
        }
    }
}
