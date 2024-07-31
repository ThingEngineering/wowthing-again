using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Extensions;

public static class ServiceCollectionExtensions
{
    // NOTE if you're here to add context pooling, good luck working out how to make it play
    //      nicely with the `dotnet ef` CLI tool and Backend/Web
    public static IServiceCollection AddPostgres(this IServiceCollection services, string connectionString)
    {
        var builder = new NpgsqlDataSourceBuilder(connectionString);
        builder.EnableDynamicJson();

        var dataSource = builder.Build();

        services.AddDbContext<WowDbContext>(options =>
        {
            options.UseNpgsql(dataSource, pgOptions => pgOptions.EnableRetryOnFailure());
#if DEBUG
            options.EnableSensitiveDataLogging();
#endif
        }, optionsLifetime: ServiceLifetime.Singleton);

        services.AddDbContextFactory<WowDbContext>(options =>
        {
            options.UseNpgsql(dataSource, pgOptions => pgOptions.EnableRetryOnFailure());
#if DEBUG
            options.EnableSensitiveDataLogging();
#endif
        });

        return services;
    }

    public static IConnectionMultiplexer AddRedis(this IServiceCollection services, string connectionString)
    {
        var redis = RedisUtilities.GetConnection(connectionString);
        services.AddSingleton<IConnectionMultiplexer>(redis);

        services.AddSingleton<JobRepository>();

        return redis;
    }

    public static JsonSerializerOptions AddJsonOptions(this IServiceCollection services)
    {
        var options = new JsonSerializerOptions
        {
            AllowTrailingCommas = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };
        services.AddSingleton(options);
        return options;
    }
}
