﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Npgsql;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Global;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Team;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Contexts
{
    public class WowDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
    {
        public DbSet<ApplicationUser> ApplicationUser { get; set; }

        public DbSet<BackgroundImage> BackgroundImage { get; set; }
        public DbSet<Image> Image { get; set; }
        public DbSet<LanguageString> LanguageString { get; set; }

        public DbSet<WowAuction> WowAuction { get; set; }
        public DbSet<WowItem> WowItem { get; set; }
        public DbSet<WowItemModifiedAppearance> WowItemModifiedAppearance { get; set; }
        public DbSet<WowMount> WowMount { get; set; }
        public DbSet<WowMythicPlusSeason> WowMythicPlusSeason { get; set; }
        public DbSet<WowPeriod> WowPeriod { get; set; }
        public DbSet<WowPet> WowPet { get; set; }
        public DbSet<WowRealm> WowRealm { get; set; }
        public DbSet<WowReputation> WowReputation { get; set; }
        public DbSet<WowReputationTier> WowReputationTier { get; set; }
        public DbSet<WowTitle> WowTitle { get; set; }
        public DbSet<WowToy> WowToy { get; set; }

        public DbSet<GlobalDailies> GlobalDailies { get; set; }

        public DbSet<PlayerAccount> PlayerAccount { get; set; }
        public DbSet<PlayerAccountGoldSnapshot> PlayerAccountGoldSnapshot { get; set; }
        public DbSet<PlayerAccountPets> PlayerAccountPets { get; set; }
        public DbSet<PlayerAccountToys> PlayerAccountToys { get; set; }
        public DbSet<PlayerAccountTransmogSources> PlayerAccountTransmogSources { get; set; }

        public DbSet<PlayerCharacter> PlayerCharacter { get; set; }
        public DbSet<PlayerCharacterAchievements> PlayerCharacterAchievements { get; set; }
        public DbSet<PlayerCharacterAddonData> PlayerCharacterAddonData { get; set; }
        public DbSet<PlayerCharacterCurrency> PlayerCharacterCurrency { get; set; }
        public DbSet<PlayerCharacterEquippedItems> PlayerCharacterEquippedItems { get; set; }
        public DbSet<PlayerCharacterItem> PlayerCharacterItem { get; set; }
        public DbSet<PlayerCharacterLockouts> PlayerCharacterLockouts { get; set; }
        public DbSet<PlayerCharacterMedia> PlayerCharacterMedia { get; set; }
        public DbSet<PlayerCharacterMounts> PlayerCharacterMounts { get; set; }
        public DbSet<PlayerCharacterMythicPlus> PlayerCharacterMythicPlus { get; set; }
        public DbSet<PlayerCharacterMythicPlusAddon> PlayerCharacterMythicPlusAddon { get; set; }
        public DbSet<PlayerCharacterMythicPlusSeason> PlayerCharacterMythicPlusSeason { get; set; }
        public DbSet<PlayerCharacterProfessions> PlayerCharacterProfessions { get; set; }
        public DbSet<PlayerCharacterQuests> PlayerCharacterQuests { get; set; }
        public DbSet<PlayerCharacterRaiderIo> PlayerCharacterRaiderIo { get; set; }
        public DbSet<PlayerCharacterReputations> PlayerCharacterReputations { get; set; }
        public DbSet<PlayerCharacterShadowlands> PlayerCharacterShadowlands { get; set; }
        public DbSet<PlayerCharacterSpecializations> PlayerCharacterSpecializations { get; set; }
        public DbSet<PlayerCharacterStatistics> PlayerCharacterStatistics { get; set; }
        public DbSet<PlayerCharacterTransmog> PlayerCharacterTransmog { get; set; }
        public DbSet<PlayerCharacterWeekly> PlayerCharacterWeekly { get; set; }

        public DbSet<PlayerCharacterAddonAchievements> PlayerCharacterAddonAchievements { get; set; }
        public DbSet<PlayerCharacterAddonMounts> PlayerCharacterAddonMounts { get; set; }
        public DbSet<PlayerCharacterAddonQuests> PlayerCharacterAddonQuests { get; set; }

        public DbSet<PlayerGuild> PlayerGuild { get; set; }
        public DbSet<PlayerGuildItem> PlayerGuildItem { get; set; }

        public DbSet<Team> Team { get; set; }
        public DbSet<TeamCharacter> TeamCharacter { get; set; }

        // Garbage query types
        public DbSet<AccountTransmogQuery> AccountTransmogQuery { get; set; }
        public DbSet<AchievementCriteriaQuery> AchievementCriteriaQuery { get; set; }
        public DbSet<CompletedAchievementsQuery> CompletedAchievementsQuery { get; set; }
        public DbSet<GoldSnapshotQuery> GoldSnapshotQuery { get; set; }
        public DbSet<LatestGoldSnapshotQuery> LatestGoldSnapshotQuery { get; set; }
        public DbSet<MountQuery> MountQuery { get; set; }
        public DbSet<SchedulerCharacterQuery> SchedulerCharacterQuery { get; set; }
        public DbSet<SchedulerUserQuery> SchedulerUserQuery { get; set; }
        public DbSet<StatisticsQuery> StatisticsQuery { get; set; }

        /*public WowDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }*/

        public WowDbContext(DbContextOptions<WowDbContext> options)
            : base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("optionsBuilder is not configured");
            }

            // Context initialized is pretty spammy
            optionsBuilder.ConfigureWarnings(b => b.Log(
                (CoreEventId.ContextInitialized, LogLevel.Debug)
            ));

            optionsBuilder.UseSnakeCaseNamingConvention();
            optionsBuilder.UseBatchEF_Npgsql();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("asp_net_users");
            builder.Entity<IdentityUserToken<long>>().ToTable("asp_net_user_tokens");
            builder.Entity<IdentityUserLogin<long>>().ToTable("asp_net_user_logins");
            builder.Entity<IdentityUserClaim<long>>().ToTable("asp_net_user_claims");
            builder.Entity<IdentityRole<long>>().ToTable("asp_net_roles");
            builder.Entity<IdentityUserRole<long>>().ToTable("asp_net_user_roles");
            builder.Entity<IdentityRoleClaim<long>>().ToTable("asp_net_role_claims");

            // Composite keys
            builder.Entity<Image>()
                .HasKey(image => new { image.Type, image.Id, image.Format });

            builder.Entity<LanguageString>()
                .HasKey(ls => new { ls.Language, ls.Type, ls.Id });

            builder.Entity<GlobalDailies>()
                .HasKey(gd => new { gd.Expansion, gd.Region });

            builder.Entity<PlayerCharacterCurrency>()
                .HasKey(pcc => new { pcc.CharacterId, pcc.CurrencyId });

            builder.Entity<PlayerCharacterMythicPlusSeason>()
                .HasKey(mps => new { mps.CharacterId, mps.Season });

            builder.Entity<WowAuction>()
                .HasKey(a => new { a.ConnectedRealmId, a.AuctionId });

            builder.Entity<WowPeriod>()
                .HasKey(p => new { p.Region, p.Id });

            builder.Entity<WowMythicPlusSeason>()
                .HasKey(s => new { s.Region, s.Id });

            // Unique indexes
            builder.Entity<PlayerAccount>()
                .HasIndex(pa => new { pa.Region, pa.AccountId })
                .IsUnique();

            builder.Entity<PlayerCharacter>()
                .HasIndex(pc => new { pc.RealmId, pc.Name })
                .IsUnique();

            builder.Entity<PlayerGuild>()
                .HasIndex(pg => new { pg.UserId, pg.RealmId, pg.Name })
                .IsUnique();

            builder.Entity<Team>()
                .HasIndex(t => new { t.Guid })
                .IsUnique();

            // Fancy indexes
            builder.Entity<LanguageString>()
                .HasIndex(ls => new { ls.Language, ls.Type, ls.Id });

            builder.Entity<LanguageString>()
                .HasIndex(ls => new { ls.String })
                .HasMethod("gin")
                .HasOperators("gin_trgm_ops");

            // Relationships
            builder.Entity<PlayerCharacterMythicPlusSeason>()
                .HasOne(s => s.Character)
                .WithMany(c => c.MythicPlusSeasons);

            // Explicitly update WowCharacter table if related WowAccount is deleted
            builder.Entity<PlayerCharacter>()
                .HasOne(c => c.Account)
                .WithMany(a => a.Characters)
                .OnDelete(DeleteBehavior.SetNull);

            // Query types have no tables either
            builder.Entity<AccountTransmogQuery>()
                .ToTable("AccountTransmogQuery", t => t.ExcludeFromMigrations());

            builder.Entity<AchievementCriteriaQuery>()
                .ToTable("AchievementCriteriaQuery", t => t.ExcludeFromMigrations());

            builder.Entity<CompletedAchievementsQuery>()
                .ToTable("CompletedAchievementsQuery", t => t.ExcludeFromMigrations());

            builder.Entity<GoldSnapshotQuery>()
                .ToTable("GoldSnapshotQuery", t => t.ExcludeFromMigrations());

            builder.Entity<LatestGoldSnapshotQuery>()
                .ToTable("LatestGoldSnapshotQuery", t => t.ExcludeFromMigrations());

            builder.Entity<MountQuery>()
                .ToTable("MountQuery", t => t.ExcludeFromMigrations());

            builder.Entity<SchedulerCharacterQuery>()
                .ToTable("SchedulerCharacterQuery", t => t.ExcludeFromMigrations());

            builder.Entity<SchedulerUserQuery>()
                .ToTable("SchedulerUserQuery", t => t.ExcludeFromMigrations());

            builder.Entity<StatisticsQuery>()
                .ToTable("StatisticsQuery", t => t.ExcludeFromMigrations());
        }

        public NpgsqlConnection GetConnection() => (NpgsqlConnection)Database.GetDbConnection();
    }
}
