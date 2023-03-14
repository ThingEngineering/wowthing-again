using Serilog;
using Serilog.Templates;
using Wowthing.Lib.Contexts;

namespace Wowthing.Tool;

public static class ToolContext
{
    public static readonly ILogger Logger;
    private static readonly DbContextOptionsBuilder<WowDbContext> _optionsBuilder;

    static ToolContext()
    {
        _optionsBuilder = new DbContextOptionsBuilder<WowDbContext>();
        _optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("WOWTHING_DATABASE"));

        Logger = new LoggerConfiguration()
            //.ReadFrom.Configuration(Configuration)
            .Enrich.FromLogContext()
            //.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss.fff} {Level:u3}] {Service}{Task} - {Message:lj}{NewLine}{Exception}")
            .WriteTo.Console(new ExpressionTemplate(
                "[{@t:HH:mm:ss.fff} {@l:u3}]" +
                "{#if Task is not null} {Task} -{#end}" +
                " {@m:lj}\n{@x}"))
            .CreateLogger();
    }

    public static WowDbContext GetDbContext() => new(_optionsBuilder.Options);
}
