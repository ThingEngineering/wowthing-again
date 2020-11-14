using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Design;
using Wowthing.Lib.Database.Contexts;

namespace Wowthing.Lib.Database.Factories
{
    public class WowDbContextFactory : IDesignTimeDbContextFactory<WowDbContext>
    {
        public WowDbContext CreateDbContext(string[] args) => new WowDbContext("Host=postgres;Username=wowthing;Password=topsecret");
    }
}
