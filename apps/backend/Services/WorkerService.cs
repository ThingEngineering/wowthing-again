using System.Linq.Expressions;
using System.Net.Http;
using System.Threading.Channels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Sentry;
using Serilog;
using Serilog.Context;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Services;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Backend.Services;

public class WorkerService : BackgroundService
{
    private static int _instanceCount;
    private static readonly Dictionary<Type, Func<object>> ConstructorMap = new();
    private static readonly Dictionary<string, Type> JobTypeMap = new();

    private readonly ILogger _logger;
    private readonly JobFactory _jobFactory;
    private readonly StateService _stateService;

    private readonly string _name;
    private readonly JobPriority _priority;
    private readonly IDbContextFactory<WowDbContext> _contextFactory;
    private readonly ChannelReader<QueuedJob> _reader;

    public WorkerService(
        JobPriority priority,
        CacheService cacheService,
        IConfiguration config,
        IDbContextFactory<WowDbContext> contextFactory,
        IHttpClientFactory clientFactory,
        JobRepository jobRepository,
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        StateService stateService
    )
    {
        _contextFactory = contextFactory;
        _stateService = stateService;

        _priority = priority;
        _name = priority.ToString()[..1];
        _reader = _stateService.JobPriorityChannels[_priority].Reader;

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
            using var jobTokenSource = new CancellationTokenSource();

            while (_stateService.AccessToken?.Valid != true)
            {
                _logger.Warning("Waiting for auth service to be ready");
                await Task.Delay(1000, jobTokenSource.Token);
            }

            await foreach (var queuedJob in _reader.ReadAllAsync(jobTokenSource.Token))
            {
                string jobTypeName = queuedJob.Type.ToString();
                Type classType = JobTypeMap[jobTypeName];
                using (LogContext.PushProperty("Task", jobTypeName))
                {
                    JobBase job = null;

                    var sentryTransaction = SentrySdk.StartTransaction($"worker: {jobTypeName}", "execute");
                    SentrySdk.ConfigureScope(scope => scope.Transaction = sentryTransaction);

                    try
                    {
                        string[] data = JsonSerializer.Deserialize<string[]>(queuedJob.Data.OrDefault("[]"));

                        job = _jobFactory.Create(classType, _contextFactory, jobTokenSource.Token);
                        job.Setup(data);
                        await job.Run(data);

                        await _stateService.SuccessfulQueuedJobs.Writer.WriteAsync(queuedJob.Id, jobTokenSource.Token);
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(ex, "Job failed");

                        await _stateService.FailedQueuedJobs.Writer.WriteAsync(queuedJob.Id, jobTokenSource.Token);

                        SentrySdk.CaptureException(ex);
                    }
                    finally
                    {
                        if (job != null)
                        {
                            await job.Finally();
                            job.Dispose();
                        }

                        sentryTransaction.Finish();
                    }
                }
            }
        }

        _logger.Warning("Service stopping?!");
    }
}
