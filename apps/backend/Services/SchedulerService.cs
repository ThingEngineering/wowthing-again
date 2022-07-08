using System.Net;
using System.Reflection;
using System.Runtime;
using Microsoft.Extensions.DependencyInjection;
using Wowthing.Backend.Jobs;
using Wowthing.Backend.Services.Base;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public sealed class SchedulerService : TimerService
    {
        private const int TimerInterval = 10;
        
        private readonly JobRepository _jobRepository;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly StateService _stateService;
        
        private readonly List<ScheduledJob> _scheduledJobs = new();
  
        public SchedulerService(
            IServiceScopeFactory serviceScopeFactory,
            JobRepository jobRepository,
            StateService stateService
        )
            : base("Scheduler", TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(TimerInterval))
        {
            _jobRepository = jobRepository;
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
            var lockValue = Guid.NewGuid().ToString("N");
            
            try
            {
                // Attempt to get exclusive scheduler lock
                var lockSuccess = await _jobRepository.AcquireLockAsync("scheduler", lockValue,
                    TimeSpan.FromSeconds(TimerInterval * 5));
                if (!lockSuccess)
                {
                    Logger.Warning("Skipping scheduler, lock failed");
                    return;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Kaboom!");
                return;
            }

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

            if (_stateService.JobQueueReaders[JobPriority.Low].Count < 5000)
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
                    var userResults = await context.SchedulerUserQuery
                        .FromSqlRaw(SchedulerUserQuery.SqlQuery)
                        .ToArrayAsync();

                    if (userResults.Length > 0)
                    {
                        var resultData = userResults
                            .Select(ur => ur.UserId.ToString());
                        
                        // Queue user jobs
                        Logger.Information("Queueing {Count} user job(s)", userResults.Length);
                        await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.UserCharacters, resultData);

                        // Update user LastApiCheck
                        var ids = userResults.Select(ur => ur.UserId);
                        await context.BatchUpdate<ApplicationUser>()
                            .Set(au => au.LastApiCheck, au => DateTime.UtcNow)
                            .Where(au => ids.Contains(au.Id))
                            .ExecuteAsync();
                    }
                    
                    // Execute some sort of nasty database query to get characters that need an API check
                    var characterResults = await context.SchedulerCharacterQuery
                        .FromSqlRaw(SchedulerCharacterQuery.SqlQuery)
                        .ToArrayAsync();
                    if (characterResults.Length > 0)
                    {
                        Logger.Debug("Pre-GC: {0}", GC.GetTotalMemory(false));
                        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
                        var postGc = GC.GetTotalMemory(true);
                        Logger.Debug("Post-GC: {0}", postGc);

                        var resultData = characterResults
                            .Select(cr => JsonConvert.SerializeObject(cr));

                        // Queue character jobs
                        Logger.Information("Queueing {0} character job(s)", characterResults.Length);
                        await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.Character, resultData);

                        // Update character LastApiCheck
                        var ids = characterResults.Select(s => s.CharacterId);
                        await context.BatchUpdate<PlayerCharacter>()
                            .Set(pc => pc.LastApiCheck, pc => DateTime.UtcNow)
                            .Where(pc => ids.Contains(pc.Id))
                            .ExecuteAsync();
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

            // Release exclusive scheduler lock
            await _jobRepository.ReleaseLockAsync("scheduler", lockValue);
        }
    }
}
