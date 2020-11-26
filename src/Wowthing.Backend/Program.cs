using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Wowthing.Backend.Models;
using Wowthing.Backend.Services;
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
                .MinimumLevel.Debug()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss.fff} {Level:u3}] {Service}{Task}{Message:lj}{NewLine}{Exception}")
                .CreateLogger();

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
            services.AddSingleton<StateService>();

            // Databases
            services.AddPostgres(Configuration.GetConnectionString("Postgres"));
            services.AddRedis(Configuration.GetConnectionString("Redis"));

            // Options
            services.AddOptions<BattleNetOptions>()
                .Bind(Configuration.GetSection("BattleNet"))
                .Validate(config =>
                {
                    return !(string.IsNullOrWhiteSpace(config.ClientID) || string.IsNullOrWhiteSpace(config.ClientSecret));
                }, "BattleNet.ClientID and .ClientSecret must be set");

            services.AddHostedService<AuthorizationService>();
            services.AddHostedService<SchedulerService>();
            
            // TODO: setting for this
            for (int i = 0; i < 4; i++)
            {
                services.AddSingleton<IHostedService, WorkerService>();
            }
        }
    }
}
