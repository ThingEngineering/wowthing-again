using System.Reflection;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Backend.Services.Base;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services;

public sealed class SchedulerService : TimerService
{
    private const int TimerInterval = 10;

    private readonly IConnectionMultiplexer _redis;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly JobRepository _jobRepository;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly StateService _stateService;

    private readonly List<ScheduledJob> _scheduledJobs = new();

    public SchedulerService(
        IConnectionMultiplexer redis,
        IServiceScopeFactory serviceScopeFactory,
        JobRepository jobRepository,
        JsonSerializerOptions jsonSerializerOptions,
        StateService stateService
    )
        : base("Scheduler", TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(TimerInterval))
    {
        _jobRepository = jobRepository;
        _jsonSerializerOptions = jsonSerializerOptions;
        _redis = redis;
        _serviceScopeFactory = serviceScopeFactory;
        _stateService = stateService;

        // Schedule jobs for all IScheduledJob implementers
        var jobTypes = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .Where(t => t.IsClass && !t.IsAbstract && t.GetInterfaces().Contains(typeof(IScheduledJob)))
            .ToArray();
        foreach (var jobType in jobTypes)
        {
            var fieldInfo = jobType.GetField("Schedule", BindingFlags.Public | BindingFlags.Static);
            _scheduledJobs.Add((ScheduledJob)fieldInfo.GetValue(null));
        }
    }

    protected override async void TimerCallback(object state)
    {
        try
        {
            // Scheduled jobs run on an interval, see if any need to be started
            foreach (var scheduledJob in _scheduledJobs)
            {
                if (await _jobRepository.CheckLastTime("scheduled_job", scheduledJob.RedisKey,
                        scheduledJob.Interval))
                {
                    Logger.Information("Queueing scheduled task {0}", scheduledJob.RedisKey);
                    await _jobRepository.AddJobAsync(scheduledJob.Priority, scheduledJob.Type);
                }
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
        }

        var db = _redis.GetDatabase();
        await db.StreamTrimAsync("stream:low", 10000, useApproximateMaxLength: true);

        var groups = await db.StreamGroupInfoAsync("stream:low");
        if (groups[0].PendingMessageCount < 5000)
        {
            try
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var contextFactory = scope.ServiceProvider.GetService<IDbContextFactory<WowDbContext>>();
                if (contextFactory == null)
                {
                    Logger.Error("contextFactory is null??");
                    return;
                }

                await using var context = await contextFactory.CreateDbContextAsync();

                // Execute some sort of nasty database query to get users that need an API check
                // var userResults = await context.SchedulerUserQuery
                //     .FromSqlRaw(SchedulerUserQuery.SqlQuery)
                //     .ToArrayAsync();
                //
                // if (userResults.Length > 0)
                // {
                //     var resultData = userResults
                //         .Select(ur => ur.UserId.ToString());
                //
                //     // Queue user jobs
                //     Logger.Information("Queueing {Count} user job(s)", userResults.Length);
                //     await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.UserCharacters, resultData);
                //
                //     // Update user LastApiCheck
                //     var ids = userResults.Select(ur => ur.UserId);
                //     await context.BatchUpdate<ApplicationUser>()
                //         .Set(au => au.LastApiCheck, au => DateTime.UtcNow)
                //         .Where(au => ids.Contains(au.Id))
                //         .ExecuteAsync();
                // }

                // Execute some sort of nasty database query to get characters that need an API check
                var characterResults = await context.SchedulerCharacterQuery
                    .FromSqlRaw(SchedulerCharacterQuery.SqlQuery)
                    .ToArrayAsync();
                if (characterResults.Length > 0)
                {
                    var resultData = characterResults
                        .Select(cr => System.Text.Json.JsonSerializer.Serialize(cr, _jsonSerializerOptions));

                    // Queue character jobs
                    Logger.Information("Queueing {0} character job(s)", characterResults.Length);
                    await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.Character, resultData);

                    // Update character LastApiCheck
                    var ids = characterResults.Select(s => s.CharacterId);
                    await context.PlayerCharacter
                        .Where(pc => ids.Contains(pc.Id))
                        .ExecuteUpdateAsync(s => s
                            .SetProperty(pc => pc.LastApiCheck, pc => DateTime.UtcNow)
                        );
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Kaboom!");
            }
        }
        else {
            Logger.Warning("Low queue is too large!");
        }
    }
}
