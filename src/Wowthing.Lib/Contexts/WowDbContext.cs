using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Npgsql;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Team;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Contexts
{
    public class WowDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
    {
        public DbSet<ApplicationUser> ApplicationUser { get; set; }

        public DbSet<WowPeriod> WowPeriod { get; set; }
        public DbSet<WowRealm> WowRealm { get; set; }
        public DbSet<WowReputation> WowReputation { get; set; }
        public DbSet<WowReputationTier> WowReputationTier { get; set; }
        public DbSet<WowMythicPlusSeason> WowMythicPlusSeason { get; set; }
        public DbSet<WowTitle> WowTitle { get; set; }

        public DbSet<PlayerAccount> PlayerAccount { get; set; }
        public DbSet<PlayerAccountToys> PlayerAccountToys { get; set; }

        public DbSet<PlayerCharacter> PlayerCharacter { get; set; }
        public DbSet<PlayerCharacterAchievements> PlayerCharacterAchievements { get; set; }
        public DbSet<PlayerCharacterCurrencies> PlayerCharacterCurrencies { get; set; }
        public DbSet<PlayerCharacterEquippedItems> PlayerCharacterEquippedItems { get; set; }
        public DbSet<PlayerCharacterLockouts> PlayerCharacterLockouts { get; set; }
        public DbSet<PlayerCharacterMythicPlus> PlayerCharacterMythicPlus { get; set; }
        public DbSet<PlayerCharacterMythicPlusAddon> PlayerCharacterMythicPlusAddon { get; set; }
        public DbSet<PlayerCharacterMythicPlusSeason> PlayerCharacterMythicPlusSeason { get; set; }
        public DbSet<PlayerCharacterProfessions> PlayerCharacterProfessions { get; set; }
        public DbSet<PlayerCharacterQuests> PlayerCharacterQuests { get; set; }
        public DbSet<PlayerCharacterRaiderIo> PlayerCharacterRaiderIo { get; set; }
        public DbSet<PlayerCharacterReputations> PlayerCharacterReputations { get; set; }
        public DbSet<PlayerCharacterShadowlands> PlayerCharacterShadowlands { get; set; }
        public DbSet<PlayerCharacterWeekly> PlayerCharacterWeekly { get; set; }

        public DbSet<Team> Team { get; set; }
        public DbSet<TeamCharacter> TeamCharacter { get; set; }

        // Garbage query types
        public DbSet<CompletedAchievementsQuery> CompletedAchievementsQuery { get; set; }
        public DbSet<SchedulerCharacterQuery> SchedulerCharacterQuery { get; set; }

        /*public WowDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }*/

        public WowDbContext(DbContextOptions<WowDbContext> options)
            : base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Context initialized is pretty spammy
            optionsBuilder.ConfigureWarnings(b => b.Log(
                (CoreEventId.ContextInitialized, LogLevel.Debug)
            ));
        
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("optionsBuilder is not configured");
            }
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
            builder.Entity<PlayerCharacterMythicPlusSeason>()
                .HasKey(mps => new { mps.CharacterId, mps.Season });

            builder.Entity<WowPeriod>()
                .HasKey(p => new { p.Region, p.Id });

            builder.Entity<WowMythicPlusSeason>()
                .HasKey(s => new { s.Region, s.Id });

            // Unique indexes
            builder.Entity<PlayerAccount>()
                .HasIndex(a => new { a.Region, a.AccountId })
                .IsUnique();

            builder.Entity<PlayerCharacter>()
                .HasIndex(c => new { c.RealmId, c.Name })
                .IsUnique();

            builder.Entity<Team>()
                .HasIndex(t => new { t.Guid })
                .IsUnique();

            // Relationships
            builder.Entity<PlayerCharacterMythicPlusSeason>()
                .HasOne(s => s.Character)
                .WithMany(c => c.MythicPlusSeasons);

            // Explicitly update WowCharacter table if related WowAccount is deleted
            builder.Entity<PlayerCharacter>()
                .HasOne(c => c.Account)
                .WithMany(a => a.Characters)
                .OnDelete(DeleteBehavior.SetNull);

            // Query types have no keys
            builder.Entity<SchedulerCharacterQuery>()
                .HasNoKey();
        }

        public NpgsqlConnection GetConnection() => (NpgsqlConnection)Database.GetDbConnection();
    }
}
