using System.Linq.Expressions;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Services;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Backend.Services;

public class WorkerService : BackgroundService
{
    private static int _instanceCount;
    private static readonly Dictionary<Type, Func<object>> ConstructorMap = new();
    private static readonly Dictionary<string, Type> JobTypeMap = new();

    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly JobFactory _jobFactory;
    private readonly StateService _stateService;

    private readonly string _name;
    private readonly string _streamKey;

    private const int MinimumIdleTime = 120 * 1000; // 2 minutes

    public WorkerService(
        JobPriority priority,
        CacheService cacheService,
        IConfiguration config,
        IConnectionMultiplexer redis,
        IHttpClientFactory clientFactory,
        IServiceScopeFactory serviceScopeFactory,
        JobRepository jobRepository,
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        StateService stateService
    )
    {
        _redis = redis;
        _serviceScopeFactory = serviceScopeFactory;
        _stateService = stateService;

        _name = priority.ToString()[..1];
        _streamKey = $"stream:{priority.ToString().ToLowerInvariant()}";

        int instanceId = Interlocked.Increment(ref _instanceCount);
        _logger = Log.ForContext("Service", $"Worker {instanceId,2}{_name}");

        string redisConnectionString = config.GetConnectionString("Redis");
        _jobFactory = new JobFactory(
            ConstructorMap,
            cacheService,
            clientFactory,
            _logger,
            jobRepository,
            jsonSerializerOptions,
            memoryCacheService,
            stateService,
            redisConnectionString
        );
    }

    // Find all jobs and cache them
    static WorkerService()
    {
        var jobTypes = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .Where(t => t.IsClass && !t.IsAbstract && t.IsSubclassOf(typeof(JobBase)))
            .ToArray();
        foreach (var jobType in jobTypes)
        {
            JobTypeMap[jobType.Name[..^3]] = jobType;

            var constructorExpression = Expression.New(jobType);
            var lambda = Expression.Lambda<Func<object>>(constructorExpression);
            ConstructorMap[jobType] = lambda.Compile();
        }
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.Information("Service starting");

        // Give things a chance to get organized
        await Task.Delay(2000, cancellationToken);

        while (!cancellationToken.IsCancellationRequested)
        {
            while (_stateService.AccessToken?.Valid != true)
            {
                _logger.Warning("Waiting for auth service to be ready");
                await Task.Delay(1000, cancellationToken);
            }

            var db = _redis.GetDatabase();
            var messages = await db.StreamReadGroupAsync(
                _streamKey,
                "consumer_group",
                _name,
                ">",
                1);

            // No messages in queue, check for any old unacknowledged ones
            if (messages.Length == 0)
            {
                var result = await db.StreamAutoClaimAsync(
                    _streamKey,
                    "consumer_group",
                    _name,
                    MinimumIdleTime,
                    StreamPosition.Beginning,
                    1
                );
                messages = result.ClaimedEntries;
            }

            // No messages at all, give up for now
            if (messages.Length == 0)
            {
                await Task.Delay(250, cancellationToken);
                continue;
            }

            var message = messages[0];
            var messageData = message.Values.ToDictionary(
                entry => entry.Name.ToString(),
                entry => entry.Value.ToString()
            );

            // _logger.Debug("Received message {id} with type {type} and keys: {keys}", message.Id,
            //     messageData["type"], string.Join(", ", messageData.Keys.Order()));

            // Create a scope to retrieve the context factory
            using var scope = _serviceScopeFactory.CreateScope();
            var contextFactory = scope.ServiceProvider.GetService<IDbContextFactory<WowDbContext>>();
            if (contextFactory == null)
            {
                throw new NullReferenceException("contextFactory is null??");
            }

            Type classType = JobTypeMap[messageData["type"]];
            using (LogContext.PushProperty("Task", messageData["type"]))
            {
                JobBase job = null;

                try
                {
                    string[] data = JsonSerializer.Deserialize<string[]>(messageData.GetValueOrDefault("data", "[]"));

                    job = _jobFactory.Create(classType, contextFactory, cancellationToken);
                    await job.Run(data);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "Job failed");
                }
                finally
                {
                    if (job != null)
                    {
                        await job.Finally();
                        job.Dispose();
                    }
                }
            }

            await db.StreamAcknowledgeAsync(_streamKey, "consumer_group", message.Id);
        }
    }
}
