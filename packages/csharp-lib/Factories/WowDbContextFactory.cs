using Microsoft.EntityFrameworkCore.Design;
using Wowthing.Lib.Contexts;

namespace Wowthing.Lib.Factories;

// This is only used by the CLI tools, which should only ever be used in a dev environment
// https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli
public class WowDbContextFactory : IDesignTimeDbContextFactory<WowDbContext>
{
    public WowDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<WowDbContext>();
        optionsBuilder.UseNpgsql("Host=postgres;Username=wowthing;Password=topsecret",
            options => options.CommandTimeout(10 * 60));

        return new WowDbContext(optionsBuilder.Options);
    }
}
