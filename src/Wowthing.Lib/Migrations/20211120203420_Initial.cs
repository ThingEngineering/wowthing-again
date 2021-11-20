using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

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
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    can_use_subdomain = table.Column<bool>(type: "boolean", nullable: false),
                    api_key = table.Column<string>(type: "text", nullable: true),
                    last_visit = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    settings = table.Column<ApplicationUserSettings>(type: "jsonb", nullable: true),
                    user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_item",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_item", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_mythic_plus_season",
                columns: table => new
                {
                    region = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_mythic_plus_season", x => new { x.region, x.id });
                });

            migrationBuilder.CreateTable(
                name: "wow_period",
                columns: table => new
                {
                    region = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false),
                    starts = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ends = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_period", x => new { x.region, x.id });
                });

            migrationBuilder.CreateTable(
                name: "wow_realm",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    region = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    slug = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_realm", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_reputation",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    tier_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_reputation", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_reputation_tier",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    min_values = table.Column<int[]>(type: "integer[]", nullable: true),
                    max_values = table.Column<int[]>(type: "integer[]", nullable: true),
                    names = table.Column<string[]>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_reputation_tier", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wow_title",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    title_female = table.Column<string>(type: "text", nullable: true),
                    title_male = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wow_title", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_role_claims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<long>(type: "bigint", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_role_claims_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "asp_net_roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_claims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_user_claims_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_logins",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_asp_net_user_logins_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_roles",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    role_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "asp_net_roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_tokens",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_asp_net_user_tokens_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_account",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    region = table.Column<int>(type: "integer", nullable: false),
                    account_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    tag = table.Column<string>(type: "text", nullable: true),
                    enabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_account_application_user_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "team",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    guid = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    region = table.Column<int>(type: "integer", nullable: false),
                    default_realm_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    slug = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true)
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
                name: "player_account_pets",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    pets = table.Column<Dictionary<long, PlayerAccountPetsPet>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_pets", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_pets_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_account_toys",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    toy_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_account_toys", x => x.account_id);
                    table.ForeignKey(
                        name: "fk_player_account_toys_player_account_account_id",
                        column: x => x.account_id,
                        principalTable: "player_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    character_id = table.Column<long>(type: "bigint", nullable: false),
                    account_id = table.Column<int>(type: "integer", nullable: true),
                    class_id = table.Column<int>(type: "integer", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    race_id = table.Column<int>(type: "integer", nullable: false),
                    realm_id = table.Column<int>(type: "integer", nullable: false),
                    faction = table.Column<int>(type: "integer", nullable: false),
                    gender = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    active_spec_id = table.Column<int>(type: "integer", nullable: false),
                    active_title_id = table.Column<int>(type: "integer", nullable: false),
                    average_item_level = table.Column<int>(type: "integer", nullable: false),
                    equipped_item_level = table.Column<int>(type: "integer", nullable: false),
                    experience = table.Column<int>(type: "integer", nullable: false),
                    guild_id = table.Column<long>(type: "bigint", nullable: false),
                    is_resting = table.Column<bool>(type: "boolean", nullable: false),
                    is_war_mode = table.Column<bool>(type: "boolean", nullable: false),
                    chromie_time = table.Column<int>(type: "integer", nullable: false),
                    played_total = table.Column<int>(type: "integer", nullable: false),
                    rested_experience = table.Column<int>(type: "integer", nullable: false),
                    copper = table.Column<long>(type: "bigint", nullable: false),
                    mount_skill = table.Column<int>(type: "integer", nullable: false),
                    delay_hours = table.Column<int>(type: "integer", nullable: false),
                    last_api_check = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    last_seen_addon = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
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
                name: "player_character_achievements",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    achievement_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    achievement_timestamps = table.Column<List<int>>(type: "integer[]", nullable: true),
                    criteria_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    criteria_amounts = table.Column<List<long>>(type: "bigint[]", nullable: true),
                    criteria_completed = table.Column<List<bool>>(type: "boolean[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_achievements", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_achievements_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_addon_mounts",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    mounts = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_addon_mounts", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_addon_mounts_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_addon_quests",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    daily_quests = table.Column<List<int>>(type: "integer[]", nullable: true),
                    weekly_quests = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_addon_quests", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_addon_quests_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_equipped_items",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    items = table.Column<Dictionary<WowInventorySlot, PlayerCharacterEquippedItem>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_equipped_items", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_equipped_items_player_character_character_",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    item_id = table.Column<int>(type: "integer", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false),
                    location = table.Column<short>(type: "smallint", nullable: false),
                    bag_id = table.Column<short>(type: "smallint", nullable: false),
                    slot = table.Column<short>(type: "smallint", nullable: false),
                    context = table.Column<short>(type: "smallint", nullable: false),
                    enchant_id = table.Column<short>(type: "smallint", nullable: false),
                    item_level = table.Column<short>(type: "smallint", nullable: false),
                    quality = table.Column<short>(type: "smallint", nullable: false),
                    suffix_id = table.Column<short>(type: "smallint", nullable: false),
                    gems = table.Column<List<int>>(type: "integer[]", nullable: true),
                    bonus_ids = table.Column<List<short>>(type: "smallint[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_item", x => x.id);
                    table.ForeignKey(
                        name: "fk_player_character_item_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_lockouts",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    last_updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    lockouts = table.Column<List<PlayerCharacterLockoutsLockout>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_lockouts", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_lockouts_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_mounts",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    mounts = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mounts", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mounts_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    current_period_id = table.Column<int>(type: "integer", nullable: false),
                    period_runs = table.Column<List<PlayerCharacterMythicPlusRun>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus_addon",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    season = table.Column<int>(type: "integer", nullable: false),
                    maps = table.Column<Dictionary<int, PlayerCharacterMythicPlusAddonMap>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus_addon", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_addon_player_character_charact",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_mythic_plus_season",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    season = table.Column<int>(type: "integer", nullable: false),
                    runs = table.Column<List<PlayerCharacterMythicPlusRun>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_mythic_plus_season", x => new { x.character_id, x.season });
                    table.ForeignKey(
                        name: "fk_player_character_mythic_plus_season_player_character_charac",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_professions",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    professions = table.Column<Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_professions", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_professions_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_quests",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    completed_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
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
                name: "player_character_raider_io",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    seasons = table.Column<Dictionary<int, PlayerCharacterRaiderIoSeasonScores>>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_raider_io", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_raider_io_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_reputations",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    reputation_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    reputation_values = table.Column<List<int>>(type: "integer[]", nullable: true),
                    extra_reputation_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    extra_reputation_values = table.Column<List<int>>(type: "integer[]", nullable: true)
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
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    covenant_id = table.Column<int>(type: "integer", nullable: false),
                    renown_level = table.Column<int>(type: "integer", nullable: false),
                    soulbind_id = table.Column<int>(type: "integer", nullable: false),
                    conduit_ids = table.Column<List<int>>(type: "integer[]", nullable: true),
                    conduit_ranks = table.Column<List<int>>(type: "integer[]", nullable: true),
                    covenants = table.Column<Dictionary<int, PlayerCharacterShadowlandsCovenant>>(type: "jsonb", nullable: true)
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
                name: "player_character_transmog",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    transmog_ids = table.Column<List<int>>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_transmog", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_transmog_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "player_character_weekly",
                columns: table => new
                {
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    keystone_scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    keystone_dungeon = table.Column<int>(type: "integer", nullable: false),
                    keystone_level = table.Column<int>(type: "integer", nullable: false),
                    torghast_scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    torghast = table.Column<Dictionary<string, int>>(type: "jsonb", nullable: true),
                    ugh_quests_scanned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ugh_quests = table.Column<Dictionary<string, PlayerCharacterWeeklyUghQuest>>(type: "jsonb", nullable: true),
                    vault = table.Column<PlayerCharacterWeeklyVault>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_character_weekly", x => x.character_id);
                    table.ForeignKey(
                        name: "fk_player_character_weekly_player_character_character_id",
                        column: x => x.character_id,
                        principalTable: "player_character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "team_character",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    team_id = table.Column<int>(type: "integer", nullable: false),
                    character_id = table.Column<int>(type: "integer", nullable: false),
                    primary_role = table.Column<int>(type: "integer", nullable: false),
                    secondary_role = table.Column<int>(type: "integer", nullable: false),
                    note = table.Column<string>(type: "text", nullable: true)
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
                name: "ix_asp_net_role_claims_role_id",
                table: "asp_net_role_claims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "asp_net_roles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_claims_user_id",
                table: "asp_net_user_claims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_logins_user_id",
                table: "asp_net_user_logins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_roles_role_id",
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
                name: "ix_player_account_region_account_id",
                table: "player_account",
                columns: new[] { "region", "account_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_player_account_user_id",
                table: "player_account",
                column: "user_id");

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
                name: "ix_player_character_item_character_id_item_id_location",
                table: "player_character_item",
                columns: new[] { "character_id", "item_id", "location" });

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

            migrationBuilder.CreateIndex(
                name: "ix_wow_item_name",
                table: "wow_item",
                column: "name")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "asp_net_role_claims");

            migrationBuilder.DropTable(
                name: "asp_net_user_claims");

            migrationBuilder.DropTable(
                name: "asp_net_user_logins");

            migrationBuilder.DropTable(
                name: "asp_net_user_roles");

            migrationBuilder.DropTable(
                name: "asp_net_user_tokens");

            migrationBuilder.DropTable(
                name: "player_account_pets");

            migrationBuilder.DropTable(
                name: "player_account_toys");

            migrationBuilder.DropTable(
                name: "player_character_achievements");

            migrationBuilder.DropTable(
                name: "player_character_addon_mounts");

            migrationBuilder.DropTable(
                name: "player_character_addon_quests");

            migrationBuilder.DropTable(
                name: "player_character_equipped_items");

            migrationBuilder.DropTable(
                name: "player_character_item");

            migrationBuilder.DropTable(
                name: "player_character_lockouts");

            migrationBuilder.DropTable(
                name: "player_character_mounts");

            migrationBuilder.DropTable(
                name: "player_character_mythic_plus");

            migrationBuilder.DropTable(
                name: "player_character_mythic_plus_addon");

            migrationBuilder.DropTable(
                name: "player_character_mythic_plus_season");

            migrationBuilder.DropTable(
                name: "player_character_professions");

            migrationBuilder.DropTable(
                name: "player_character_quests");

            migrationBuilder.DropTable(
                name: "player_character_raider_io");

            migrationBuilder.DropTable(
                name: "player_character_reputations");

            migrationBuilder.DropTable(
                name: "player_character_shadowlands");

            migrationBuilder.DropTable(
                name: "player_character_transmog");

            migrationBuilder.DropTable(
                name: "player_character_weekly");

            migrationBuilder.DropTable(
                name: "team_character");

            migrationBuilder.DropTable(
                name: "wow_item");

            migrationBuilder.DropTable(
                name: "wow_mythic_plus_season");

            migrationBuilder.DropTable(
                name: "wow_period");

            migrationBuilder.DropTable(
                name: "wow_realm");

            migrationBuilder.DropTable(
                name: "wow_reputation");

            migrationBuilder.DropTable(
                name: "wow_reputation_tier");

            migrationBuilder.DropTable(
                name: "wow_title");

            migrationBuilder.DropTable(
                name: "asp_net_roles");

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
