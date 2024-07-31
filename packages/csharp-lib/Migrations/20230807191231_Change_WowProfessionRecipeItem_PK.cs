using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Change_WowProfessionRecipeItem_PK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_wow_profession_recipe_item",
                table: "wow_profession_recipe_item");

            migrationBuilder.AlterColumn<int>(
                name: "skill_line_ability_id",
                table: "wow_profession_recipe_item",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_wow_profession_recipe_item",
                table: "wow_profession_recipe_item",
                columns: new[] { "skill_line_ability_id", "item_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_wow_profession_recipe_item",
                table: "wow_profession_recipe_item");

            migrationBuilder.AlterColumn<int>(
                name: "skill_line_ability_id",
                table: "wow_profession_recipe_item",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_wow_profession_recipe_item",
                table: "wow_profession_recipe_item",
                column: "skill_line_ability_id");
        }
    }
}
