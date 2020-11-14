using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Wowthing.Lib.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddRedis(this IServiceCollection services, string connectionString)
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.ClientName = Assembly.GetCallingAssembly().GetName().Name;

            return services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(options));
        }
    }
}
