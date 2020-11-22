using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack.Redis;
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

            return services;
        }

        public static IRedisClientsManager AddRedis(this IServiceCollection services, string connectionString)
        {
            connectionString = connectionString.Replace("client=*", $"client={Assembly.GetCallingAssembly().GetName().Name}");
            
            var redis = new RedisManagerPool(connectionString);
            services.AddSingleton<IRedisClientsManager>(redis);

            services.AddSingleton<JobRepository>();

            return redis;
        }
    }
}
