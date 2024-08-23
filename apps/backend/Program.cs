using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Polly;
using Sentry;
using Serilog;
using Serilog.Templates;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models;
using Wowthing.Backend.Services;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend;

public class Program
{
    public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .AddEnvironmentVariables()
        .Build();

    public static void Main(string[] args)
    {
        ServicePointManager.DefaultConnectionLimit = 10;

        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(Configuration)
            .Enrich.FromLogContext()
            //.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss.fff} {Level:u3}] {Service}{Task} - {Message:lj}{NewLine}{Exception}")
            .WriteTo.Console(new ExpressionTemplate(
                "[{@t:HH:mm:ss.fff} {@l:u3} {Coalesce(Service, '<unknown>'),-10}]" +
                "{#if Task is not null} {Task} -{#end}" +
                " {@m:lj}\n{@x}"))
            .CreateLogger();

        // JsonConvert.DefaultSettings = () => new JsonSerializerSettings
        // {
        //     ContractResolver = new DefaultContractResolver
        //     {
        //         NamingStrategy = new CamelCaseNamingStrategy(),
        //     },
        // };

        if (Environment.GetEnvironmentVariable("SENTRY_DSN") != null)
        {
            Log.Warning("Initializing Sentry");

            SentrySdk.Init(options =>
            {
                options.AutoSessionTracking = true;

#if DEBUG
                options.Environment = "development";
                options.ProfilesSampleRate = 1.0;
                options.TracesSampleRate = 1.0;
#else
                options.Environment = "production";
                options.ProfilesSampleRate = 0.1;
                options.TracesSampleRate = 0.1;
#endif
                // ??
            });
        }

        try
        {
            CreateHostBuilder(args)
                .Build()
                .ValidateOptions<BattleNetOptions>()
                .Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices(ConfigureServices)
            .UseSerilog();

    private static void ConfigureServices(HostBuilderContext hostContext, IServiceCollection services)
    {
        // Options
        services.AddOptions<BattleNetOptions>()
            .Bind(Configuration.GetSection("BattleNet"))
            .Validate(config =>
            {
                return !(string.IsNullOrWhiteSpace(config.ClientId) || string.IsNullOrWhiteSpace(config.ClientSecret));
            }, "BattleNet.ClientID and .ClientSecret must be set");

        var backendConfig = Configuration.GetSection("WowthingBackend");
        var backendOptions = new WowthingBackendOptions();
        backendConfig.Bind(backendOptions);

        services.Configure<WowthingBackendOptions>(backendConfig);

        // Memory cache
        services.AddMemoryCache();

        // Databases
        services.AddPostgres(Configuration.GetConnectionString("Postgres"));

        var redisConnectionString = Configuration.GetConnectionString("Redis");
        services.AddRedis(redisConnectionString);

        // HTTP clients
        var rateLimitPolicy = Policy
            .RateLimitAsync<HttpResponseMessage>(
                backendOptions.ApiRateLimit,
                TimeSpan.FromSeconds(1),
                backendOptions.ApiRateLimit
            );

        services.AddHttpClient("limited", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(120);
            })
            .AddPolicyHandler(rateLimitPolicy)
            .SetHandlerLifetime(Timeout.InfiniteTimeSpan);

        // JSON options
        services.AddJsonOptions();

        // Services
        services.AddSingleton<CacheService>();
        services.AddSingleton<MemoryCacheService>();
        services.AddSingleton<StateService>();

        services.AddHostedService<AuthorizationService>();
        services.AddHostedService<GarbageService>();
        services.AddHostedService<GoldSnapshotService>();
        services.AddHostedService<SchedulerService>();
        services.AddHostedService<UserLeaderboardService>();

        foreach (var priority in EnumUtilities.GetValues<JobPriority>())
        {
            services.AddSingleton<IHostedService>(sp => ActivatorUtilities.CreateInstance<JobQueueService>(sp, priority));
        }

        for (int i = 0; i < backendOptions.WorkerCountHigh; i++)
        {
            services.AddSingleton<IHostedService>(sp =>
                ActivatorUtilities.CreateInstance<WorkerService>(sp, JobPriority.High));
        }

        for (int i = 0; i < backendOptions.WorkerCountLow; i++)
        {
            services.AddSingleton<IHostedService>(sp =>
                ActivatorUtilities.CreateInstance<WorkerService>(sp, JobPriority.Low));
        }

        for (int i = 0; i < backendOptions.WorkerCountAuction; i++)
        {
            services.AddSingleton<IHostedService>(sp =>
                ActivatorUtilities.CreateInstance<WorkerService>(sp, JobPriority.Auction));
        }
    }
}
