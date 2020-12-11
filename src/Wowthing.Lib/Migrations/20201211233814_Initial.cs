using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "asp_net_roles",
                columns: table => new
                {
                    id = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    normalized_name = table.Column<string>(nullable: true),
                    concurrency_stamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_identity_role", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_users",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_name = table.Column<string>(maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(maxLength: 256, nullable: true),
                    email = table.Column<string>(maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(nullable: false),
                    password_hash = table.Column<string>(nullable: true),
                    security_stamp = table.Column<string>(nullable: true),
                    concurrency_stamp = table.Column<string>(nullable: true),
                    phone_number = table.Column<string>(nullable: true),
                    phone_number_confirmed = table.Column<bool>(nullable: false),
                    two_factor_enabled = table.Column<bool>(nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(nullable: true),
                    lockout_enabled = table.Column<bool>(nullable: false),
                    access_failed_count = table.Column<int>(nullable: false),
                    settings = table.Column<ApplicationUserSettings>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(maxLength: 256, nullable: true),
                    concurrency_stamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "scheduler_character_query",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    realm_slug = table.Column<string>(nullable: true),
                    character_id = table.Column<long>(nullable: false),
                    character_name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "team",
                columns: table => new
                {
                    id = table.Column<Guid>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    default_realm_id = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_team", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_class",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    icon = table.Column<string>(nullable: true),
                    specialization_ids = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_class", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_race",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    icon_female = table.Column<string>(nullable: true),
                    icon_male = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_race", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_realm",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    slug = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_realm", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_reputation",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    tier_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_reputation", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_reputation_tier",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    min_values = table.Column<int[]>(nullable: true),
                    max_values = table.Column<int[]>(nullable: true),
                    names = table.Column<string[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_reputation_tier", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_title",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(nullable: true),
                    title_female = table.Column<string>(nullable: true),
                    title_male = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_title", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_claims",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(nullable: false),
                    claim_type = table.Column<string>(nullable: true),
                    claim_value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_claims_asp_net_users_application_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_logins",
                columns: table => new
                {
                    login_provider = table.Column<string>(nullable: false),
                    provider_key = table.Column<string>(nullable: false),
                    provider_display_name = table.Column<string>(nullable: true),
                    user_id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_user_logins_asp_net_users_application_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_tokens",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    login_provider = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: false),
                    value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_user_tokens_asp_net_users_application_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_account",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(nullable: false),
                    region = table.Column<int>(nullable: false),
                    account_id = table.Column<long>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    tag = table.Column<string>(nullable: true),
                    enabled = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_account_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_role_claims",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<long>(nullable: false),
                    claim_type = table.Column<string>(nullable: true),
                    claim_value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_role_claims_asp_net_roles_identity_role_long_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_roles",
                columns: table => new
                {
                    user_id = table.Column<long>(nullable: false),
                    role_id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_user_roles_asp_net_roles_identity_role_long_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_roles_asp_net_users_application_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    character_id = table.Column<long>(nullable: false),
                    account_id = table.Column<int>(nullable: true),
                    class_id = table.Column<int>(nullable: false),
                    level = table.Column<int>(nullable: false),
                    race_id = table.Column<int>(nullable: false),
                    realm_id = table.Column<int>(nullable: false),
                    faction = table.Column<int>(nullable: false),
                    gender = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    active_spec_id = table.Column<int>(nullable: false),
                    active_title_id = table.Column<int>(nullable: false),
                    average_item_level = table.Column<int>(nullable: false),
                    equipped_item_level = table.Column<int>(nullable: false),
                    experience = table.Column<int>(nullable: false),
                    guild_id = table.Column<long>(nullable: false),
                    delay_hours = table.Column<int>(nullable: false),
                    last_api_check = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_character_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "player_character_quests",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    completed_ids = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_quests", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_quests_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_reputations",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    reputation_ids = table.Column<List<int>>(nullable: true),
                    reputation_values = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_reputations", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_reputations_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_shadowlands",
                columns: table => new
                {
                    character_id = table.Column<int>(nullable: false),
                    covenant_id = table.Column<int>(nullable: false),
                    renown_level = table.Column<int>(nullable: false),
                    soulbind_id = table.Column<int>(nullable: false),
                    conduit_ids = table.Column<List<int>>(nullable: true),
                    conduit_ranks = table.Column<List<int>>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_shadowlands", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_shadowlands_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "team_character",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    character_id = table.Column<int>(nullable: false),
                    primary_role = table.Column<int>(nullable: false),
                    secondary_role = table.Column<int>(nullable: false),
                    note = table.Column<string>(nullable: true),
                    team_id = table.Column<Guid>(nullable: true)
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
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_role_claims_role_id",
                table: "asp_net_role_claims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_claims_user_id",
                table: "asp_net_user_claims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_logins_user_id",
                table: "asp_net_user_logins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_roles_role_id",
                table: "asp_net_user_roles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "asp_net_users",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "asp_net_users",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_player_account_user_id",
                table: "player_account",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_player_account_region_account_id",
                table: "player_account",
                columns: new[] { "region", "account_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_player_character_account_id",
                table: "player_character",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "ix_player_character_realm_id_name",
                table: "player_character",
                columns: new[] { "realm_id", "name" },
                unique: true);

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
                name: "asp_net_role_claims");

            migrationBuilder.DropTable(
                name: "asp_net_roles");

            migrationBuilder.DropTable(
                name: "asp_net_user_claims");

            migrationBuilder.DropTable(
                name: "asp_net_user_logins");

            migrationBuilder.DropTable(
                name: "asp_net_user_roles");

            migrationBuilder.DropTable(
                name: "asp_net_user_tokens");

            migrationBuilder.DropTable(
                name: "player_character_quests");

            migrationBuilder.DropTable(
                name: "player_character_reputations");

            migrationBuilder.DropTable(
                name: "player_character_shadowlands");

            migrationBuilder.DropTable(
                name: "scheduler_character_query");

            migrationBuilder.DropTable(
                name: "team_character");

            migrationBuilder.DropTable(
                name: "wow_class");

            migrationBuilder.DropTable(
                name: "wow_race");

            migrationBuilder.DropTable(
                name: "wow_realm");

            migrationBuilder.DropTable(
                name: "wow_reputation");

            migrationBuilder.DropTable(
                name: "wow_reputation_tier");

            migrationBuilder.DropTable(
                name: "wow_title");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "player_character");

            migrationBuilder.DropTable(
                name: "team");

            migrationBuilder.DropTable(
                name: "player_account");

            migrationBuilder.DropTable(
                name: "asp_net_users");
        }
    }
}
