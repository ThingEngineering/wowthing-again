using Microsoft.Extensions.Hosting;
using Serilog;
using StackExchange.Redis;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class JobQueueService : BackgroundService
{
    private readonly IConnectionMultiplexer _redis;

    private readonly ILogger _logger;
    private readonly JobPriority[] _priorities;
    private readonly Dictionary<JobPriority, string> _streamKeys;

    public JobQueueService(
        IConnectionMultiplexer redis
    )
    {
        _redis = redis;

        _logger = Log.ForContext("Service", $"JobQueue");
        _priorities = EnumUtilities.GetValues<JobPriority>();
        _streamKeys = _priorities.ToDictionary(
            priority => priority,
            priority => $"stream:{priority.ToString().ToLowerInvariant()}"
        );

        var db = _redis.GetDatabase();
        foreach (var priority in _priorities)
        {
            db.StreamCreateConsumerGroup(
                _streamKeys[priority],
                "consumer_group",
                StreamPosition.Beginning,
                true,
                CommandFlags.FireAndForget
            );
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(10000, stoppingToken);

            var db = _redis.GetDatabase();
            foreach (var priority in _priorities)
            {
                var groups = await db.StreamGroupInfoAsync(_streamKeys[priority]);
                if (groups[0].Lag > 1000)
                {
                    _logger.Warning("{Priority} queue is at {Count}!", priority.ToString(),
                        groups[0].Lag);
                }
            }
        }
    }
}
