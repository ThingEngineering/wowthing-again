using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_LanguageString_Modify_WowItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_wow_item_name",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "name",
                table: "wow_item");

            migrationBuilder.AddColumn<short>(
                name: "class_id",
                table: "wow_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<int>(
                name: "class_mask",
                table: "wow_item",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<short>(
                name: "container_slots",
                table: "wow_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "inventory_type",
                table: "wow_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<long>(
                name: "race_mask",
                table: "wow_item",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "stackable",
                table: "wow_item",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<short>(
                name: "subclass_id",
                table: "wow_item",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.CreateTable(
                name: "language_string",
                columns: table => new
                {
                    language = table.Column<short>(type: "smallint", nullable: false),
                    type = table.Column<short>(type: "smallint", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false),
                    @string = table.Column<string>(name: "string", type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_language_string", x => new { x.language, x.type, x.id });
                });

            migrationBuilder.CreateIndex(
                name: "ix_language_string_language_type_id",
                table: "language_string",
                columns: new[] { "language", "type", "id" });

            migrationBuilder.CreateIndex(
                name: "ix_language_string_string",
                table: "language_string",
                column: "string")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "language_string");

            migrationBuilder.DropColumn(
                name: "class_id",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "class_mask",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "container_slots",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "inventory_type",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "race_mask",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "stackable",
                table: "wow_item");

            migrationBuilder.DropColumn(
                name: "subclass_id",
                table: "wow_item");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "wow_item",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_wow_item_name",
                table: "wow_item",
                column: "name")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }
    }
}
