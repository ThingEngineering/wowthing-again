using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_WowCharacterSpecialization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<short>(
                name: "secondary_role",
                table: "team_character",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<short>(
                name: "primary_role",
                table: "team_character",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateTable(
                name: "wow_character_specialization",
                columns: table => new
                {
                    id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    class_id = table.Column<short>(type: "smallint", nullable: false),
                    order = table.Column<short>(type: "smallint", nullable: false),
                    role = table.Column<short>(type: "smallint", nullable: false),
                    primary_stat = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_character_specialization", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wow_character_specialization");

            migrationBuilder.AlterColumn<int>(
                name: "secondary_role",
                table: "team_character",
                type: "integer",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<int>(
                name: "primary_role",
                table: "team_character",
                type: "integer",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");
        }
    }
}
