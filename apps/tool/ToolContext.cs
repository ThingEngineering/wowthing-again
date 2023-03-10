using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Contexts;

namespace Wowthing.Tool;

public static class ToolContext
{
    private static readonly DbContextOptionsBuilder<WowDbContext> _optionsBuilder;

    static ToolContext()
    {
        _optionsBuilder = new DbContextOptionsBuilder<WowDbContext>();
        _optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("WOWTHING_DATABASE"));
    }

    public static WowDbContext GetDbContext() => new(_optionsBuilder.Options);
}
