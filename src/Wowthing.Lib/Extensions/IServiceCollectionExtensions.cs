using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System.Reflection;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Extensions
{
    public static class ServiceCollectionExtensions
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

            return services;
        }

        public static IConnectionMultiplexer AddRedis(this IServiceCollection services, string connectionString)
        {
            var redis = RedisUtilities.GetConnection(connectionString);
            services.AddSingleton<IConnectionMultiplexer>(redis);

            services.AddSingleton<JobRepository>();

            return redis;
        }
    }
}
