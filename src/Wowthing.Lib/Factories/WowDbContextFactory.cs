using Microsoft.EntityFrameworkCore.Design;
using Wowthing.Lib.Contexts;

namespace Wowthing.Lib.Factories
{
    public class WowDbContextFactory : IDesignTimeDbContextFactory<WowDbContext>
    {
        public WowDbContext CreateDbContext(string[] args) => new WowDbContext("Host=postgres;Username=wowthing;Password=topsecret");
    }
}
