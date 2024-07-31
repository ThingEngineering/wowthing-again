using System.Text.Encodings.Web;
using Npgsql;
using Serilog;
using Serilog.Templates;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;

namespace Wowthing.Tool;

public static class ToolContext
{
    public static readonly ConnectionMultiplexer Redis;
    public static readonly ILogger Logger;

    private static readonly DbContextOptionsBuilder<WowDbContext> OptionsBuilder;
    private static readonly JsonSerializerOptions JsonOptions;

    static ToolContext()
    {
        JsonOptions = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            // We control both ends of the pipeline and don't write anything weird, stop
            // escaping my damn apostrophes
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        var builder = new NpgsqlDataSourceBuilder(Environment.GetEnvironmentVariable("WOWTHING_DATABASE"));
        builder.EnableDynamicJson();

        var dataSource = builder.Build();

        OptionsBuilder = new DbContextOptionsBuilder<WowDbContext>();
        OptionsBuilder.UseNpgsql(dataSource);

        Logger = new LoggerConfiguration()
            //.ReadFrom.Configuration(Configuration)
            .Enrich.FromLogContext()
            //.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss.fff} {Level:u3}] {Service}{Task} - {Message:lj}{NewLine}{Exception}")
            .WriteTo.Console(new ExpressionTemplate(
                "[{@t:HH:mm:ss.fff} {@l:u3}]" +
                "{#if Task is not null} {Task} -{#end}" +
                " {@m:lj}\n{@x}"))
            .CreateLogger();

        Redis = RedisUtilities.GetConnection(Environment.GetEnvironmentVariable("WOWTHING_REDIS"));
    }

    public static WowDbContext GetDbContext() => new(OptionsBuilder.Options);

    public static string SerializeJson<T>(T data) => JsonSerializer.Serialize(data, JsonOptions);
}
