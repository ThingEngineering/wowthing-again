using System.Reflection;
using StackExchange.Redis;

namespace Wowthing.Lib.Utilities;

public static class RedisUtilities
{
    public static ConnectionMultiplexer GetConnection(string connectionString)
    {
        var options = ConfigurationOptions.Parse(connectionString);
        options.ChannelPrefix = RedisChannel.Literal("wowthing_");
        options.ClientName = Assembly.GetCallingAssembly().GetName().Name;
        options.AbortOnConnectFail = false;

        return ConnectionMultiplexer.Connect(options);
    }
}
