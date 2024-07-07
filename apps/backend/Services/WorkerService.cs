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
    private readonly JobPriority _priority;
    private readonly IDbContextFactory<WowDbContext> _contextFactory;

    private const int MinimumIdleTime = 120 * 1000; // 2 minutes

    public WorkerService(
        JobPriority priority,
        CacheService cacheService,
        IConfiguration config,
        IConnectionMultiplexer redis,
        IDbContextFactory<WowDbContext> contextFactory,
        IHttpClientFactory clientFactory,
        IServiceScopeFactory serviceScopeFactory,
        JobRepository jobRepository,
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        StateService stateService
    )
    {
        _contextFactory = contextFactory;
        _redis = redis;
        _serviceScopeFactory = serviceScopeFactory;
        _stateService = stateService;

        _priority = priority;
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

            await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

            var queuedJob = await context.QueuedJob
                .FromSql($@"
SELECT  *
FROM    queued_job
WHERE   priority = {_priority}
        AND started_at IS NULL
ORDER BY id
FOR UPDATE SKIP LOCKED
LIMIT 1
")
                .SingleOrDefaultAsync(cancellationToken);

            if (queuedJob == null)
            {
                await Task.Delay(250, cancellationToken);
                continue;
            }

            queuedJob.StartedAt = DateTime.UtcNow;
            await context.SaveChangesAsync(cancellationToken);

            string jobTypeName = queuedJob.Type.ToString();
            Type classType = JobTypeMap[jobTypeName];
            using (LogContext.PushProperty("Task", jobTypeName))
            {
                JobBase job = null;

                try
                {
                    string[] data = JsonSerializer.Deserialize<string[]>(queuedJob.Data.OrDefault("[]"));

                    job = _jobFactory.Create(classType, _contextFactory, cancellationToken);
                    await job.Run(data);

                    await context.QueuedJob.Where(qj => qj.Id == queuedJob.Id).ExecuteDeleteAsync(cancellationToken);
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
        }
    }
}
