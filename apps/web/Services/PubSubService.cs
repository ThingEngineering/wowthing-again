using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Web.Hubs;

namespace Wowthing.Web.Services;

public class PubSubService : IHostedService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IHubContext<UserUpdateHub> _userUpdateHub;
    private readonly ILogger<PubSubService> _logger;

    public PubSubService(
        IConnectionMultiplexer redis,
        IHubContext<UserUpdateHub> userUpdateHub,
        ILogger<PubSubService> logger
    )
    {
        _redis = redis;
        _logger = logger;
        _userUpdateHub = userUpdateHub;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var queue = await _redis
                .GetSubscriber()
                .SubscribeAsync(RedisKeys.UserUpdatesChannel);

        queue.OnMessage(async channelMessage =>
        {
            string message = channelMessage.Message.ToString();
            // _logger.LogDebug("PubSub: {msg}", message);

            string[] parts = message.Split("|");
            await _userUpdateHub
                .Clients
                .Group(parts[0])
                .SendAsync("dataUpdated", parts[1], parts[2], cancellationToken: cancellationToken);
        });
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        await _redis.GetSubscriber()
            .UnsubscribeAsync(RedisKeys.UserUpdatesChannel);
    }
}
