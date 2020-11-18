using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;

namespace Wowthing.Lib.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddPostgres(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<WowDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
#if DEBUG
                options.EnableSensitiveDataLogging();
#endif
            });

            services.AddScoped<CharacterRepository>();
            services.AddScoped<DataRepository>();
            services.AddScoped<UserRepository>();

            return services;
        }

        public static IConnectionMultiplexer AddRedis(this IServiceCollection services, string connectionString)
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.ClientName = Assembly.GetCallingAssembly().GetName().Name;

            var redis = ConnectionMultiplexer.Connect(options);
            services.AddSingleton<IConnectionMultiplexer>(redis);

            services.AddSingleton<JobRepository>();

            return redis;
        }
    }
}
