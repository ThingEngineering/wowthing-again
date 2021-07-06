using System;
using System.IO;
using System.Net;
using System.Threading;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models;
using Wowthing.Backend.Services;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend
{
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
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss.fff} {Level:u3}] {Service}{Task}{Message:lj}{NewLine}{Exception}")
                .CreateLogger();

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy(),
                }
            };

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
                    return !(string.IsNullOrWhiteSpace(config.ClientID) || string.IsNullOrWhiteSpace(config.ClientSecret));
                }, "BattleNet.ClientID and .ClientSecret must be set");

            var backendOptions = new WowthingBackendOptions();
            Configuration.GetSection("WowthingBackend").Bind(backendOptions);
            
            // Databases
            services.AddPostgres(Configuration.GetConnectionString("Postgres"));
            var redis = services.AddRedis(Configuration.GetConnectionString("Redis"));

            // HTTP clients
            services.AddHttpClient("limited", config =>
            {
                config.Timeout = TimeSpan.FromSeconds(backendOptions.ApiRateLimit);
            })
                .AddHttpMessageHandler(() => new RateLimitHttpMessageHandler(redis))
                .SetHandlerLifetime(Timeout.InfiniteTimeSpan);

            // Services
            services.AddSingleton<StateService>();

            services.AddHostedService<AuthorizationService>();
            services.AddHostedService<JobQueueService>(); 
            services.AddHostedService<SchedulerService>();
            
            for (var i = 0; i < backendOptions.WorkerCount; i++)
            {
                services.AddSingleton<IHostedService, WorkerService>();
            }
        }
    }
}
