using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Wowthing.Lib.Database.Models;

namespace Wowthing.Lib.Database.Contexts
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

        /*protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }*/

        public NpgsqlConnection GetConnection() => (NpgsqlConnection)Database.GetDbConnection();
    }
}
