using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Wowthing.Lib.Migrations
{
    public partial class Add_Team_TeamCharacter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "team",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    guid = table.Column<Guid>(nullable: false),
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    default_realm_id = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    slug = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_team", x => x.id);
                    table.ForeignKey(
                        name: "fk_team_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "team_character",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    team_id = table.Column<int>(nullable: false),
                    character_id = table.Column<int>(nullable: false),
                    primary_role = table.Column<int>(nullable: false),
                    secondary_role = table.Column<int>(nullable: false),
                    note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_team_character", x => x.id);
                    table.ForeignKey(
                        name: "fk_team_character_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_team_character_team_team_id",
                        column: x => x.team_id,
                        principalTable: "team",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_team_guid",
                table: "team",
                column: "guid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_team_user_id",
                table: "team",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_team_character_character_id",
                table: "team_character",
                column: "character_id");

            migrationBuilder.CreateIndex(
                name: "ix_team_character_team_id",
                table: "team_character",
                column: "team_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "team_character");

            migrationBuilder.DropTable(
                name: "team");
        }
    }
}
