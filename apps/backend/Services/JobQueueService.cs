using System.Text.Json;
using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Serilog;
using StackExchange.Redis;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class JobQueueService : BackgroundService
{
    private readonly Dictionary<JobPriority, Channel<WorkerJob>> _channels = new();
    private readonly ILogger _logger;

    public JobQueueService(
        IConnectionMultiplexer redis,
        JsonSerializerOptions jsonSerializerOptions,
        StateService stateService
    )
    {
        _logger = Log.ForContext("Service", $"JobQueue");

        foreach (var priority in EnumUtilities.GetValues<JobPriority>())
        {
            _channels[priority] = Channel.CreateUnbounded<WorkerJob>(new UnboundedChannelOptions
            {
                SingleReader = false,
                SingleWriter = false,
            });
            stateService.JobQueueReaders[priority] = _channels[priority].Reader;
        }

        redis.GetSubscriber()
            .Subscribe(RedisChannel.Literal("jobs"))
            .OnMessage(async msg =>
                {
                    var job = System.Text.Json.JsonSerializer.Deserialize<WorkerJob>(msg.Message, jsonSerializerOptions);
                    if (!stateService.QueuedJobs.ContainsKey(job.Key))
                    {
                        stateService.QueuedJobs[job.Key] = true;
                        await _channels[job.Priority].Writer.WriteAsync(job);
                    }
                    else
                    {
                        _logger.Debug("Refusing to queue duplicate job {key}", job.Key);
                    }
                }
            );
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(10000, stoppingToken);

            foreach (var priority in EnumUtilities.GetValues<JobPriority>())
            {
                int count = _channels[priority].Reader.Count;
                if (count > 1000)
                {
                    _logger.Warning("{Priority} queue is at {Count}!", priority.ToString(), count);
                }
            }
        }
    }
}
