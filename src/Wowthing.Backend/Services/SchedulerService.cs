using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Backend.Services.Base;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Repositories;
using Z.EntityFramework.Plus;

namespace Wowthing.Backend.Services
{
    public sealed class SchedulerService : TimerService
    {
        private const int TIMER_INTERVAL = 5;
        
        private readonly IConnectionMultiplexer _redis;
        private readonly JobRepository _jobRepository;
        private readonly IServiceScope _scope;
        private readonly WowDbContext _context;
        
        private readonly List<ScheduledJob> _scheduledJobs = new List<ScheduledJob>();

        private const string QUERY_CHARACTERS = @"
SELECT  c.id AS character_id,
        c.name AS character_name,
        r.region,
        r.slug AS realm_slug,
        a.user_id
FROM    player_character c
INNER JOIN wow_realm r ON c.realm_id = r.id
INNER JOIN player_account a ON c.account_id = a.id
WHERE (
    (current_timestamp - c.last_api_check) > (
        '10 minutes'::interval +
        ('1 minute'::interval * LEAST(50, GREATEST(0, 60 - c.level))) +
        ('1 hour'::interval * LEAST(168, c.delay_hours))
    )
)
ORDER BY c.last_api_check
LIMIT 100
";

        public SchedulerService(IConnectionMultiplexer redis, IServiceProvider services, JobRepository jobRepository)
            : base("Scheduler", TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(TIMER_INTERVAL))
        {
            _redis = redis;
            _jobRepository = jobRepository;

            // Get a scope and context
            _scope = services.CreateScope();
            _context = _scope.ServiceProvider.GetService<WowDbContext>();

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
            var lockValue = new Guid().ToString("N");
            
            try
            {
                // Attempt to get exclusive scheduler lock
                var lockSuccess = await _jobRepository.AcquireLockAsync("scheduler", lockValue,
                    TimeSpan.FromSeconds(TIMER_INTERVAL * 5));
                if (!lockSuccess)
                {
                    _logger.Warning("Skipping scheduler, lock failed");
                    return;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Kaboom!");
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
                        _logger.Information("Queueing scheduled task {0}", scheduledJob.RedisKey);
                        await _jobRepository.AddJobAsync(scheduledJob.Priority, scheduledJob.Type);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Kaboom!");
            }

            try
            {
                // Execute some sort of nasty database query to get characters that need an API check
                var results = await _context.SchedulerCharacterQuery.FromSqlRaw(QUERY_CHARACTERS).ToArrayAsync();
                if (results.Length > 0)
                {
                    var db = _redis.GetDatabase();

                    var resultData = results.Select(r => new
                    {
                        Result = r,
                        Json = JsonConvert.SerializeObject(r),
                    });

                    // Queue character jobs
                    _logger.Information("Queueing {0} character job(s)", results.Length);
                    await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.Character,
                        resultData.Select(d => d.Json));

                    // Update ApiCheckTime
                    var ids = results.Select(s => s.CharacterId);
                    await _context.PlayerCharacter.Where(c => ids.Contains(c.Id))
                        .UpdateAsync(c => new PlayerCharacter {LastApiCheck = DateTime.UtcNow});
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Kaboom!");
            }
            finally
            {
                // Release exclusive scheduler lock
                await _jobRepository.ReleaseLockAsync("scheduler", lockValue);
            }
        }
    }
}
