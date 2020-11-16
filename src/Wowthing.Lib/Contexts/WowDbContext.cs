using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Contexts
{
    public class WowDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly string _connectionString;

        public WowDbContext(string connectionString)
            : base()
        {
            _connectionString = connectionString;
        }

        public WowDbContext(DbContextOptions<WowDbContext> options)
            : base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql(_connectionString);
            }
            optionsBuilder.UseSnakeCaseNamingConvention();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("asp_net_users");
            builder.Entity<IdentityUserToken<string>>().ToTable("asp_net_user_tokens");
            builder.Entity<IdentityUserLogin<string>>().ToTable("asp_net_user_logins");
            builder.Entity<IdentityUserClaim<string>>().ToTable("asp_net_user_claims");
            builder.Entity<IdentityRole>().ToTable("asp_net_roles");
            builder.Entity<IdentityUserRole<string>>().ToTable("asp_net_user_roles");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("asp_net_role_claims");
        }

        public NpgsqlConnection GetConnection() => (NpgsqlConnection)Database.GetDbConnection();
    }
}
