using System.Reflection;
using StackExchange.Redis;

namespace Wowthing.Lib.Utilities
{
    public static class RedisUtilities
    {
        public static ConnectionMultiplexer GetConnection(string connectionString)
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.ChannelPrefix = "wowthing_";
            options.ClientName = Assembly.GetCallingAssembly().GetName().Name;

            return ConnectionMultiplexer.Connect(options);
        }
    }
}
