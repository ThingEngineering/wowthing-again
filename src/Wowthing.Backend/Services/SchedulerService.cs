using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MoreLinq;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
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
        c.level AS character_level,
        c.last_modified,
        c.last_api_check,
        r.region,
        r.slug AS realm_slug,
        a.user_id
FROM    player_character c
INNER JOIN wow_realm r ON c.realm_id = r.id
INNER JOIN player_account a ON c.account_id = a.id
WHERE (
    current_timestamp - c.last_api_check > (
        '10 minutes'::interval +
        ('1 minute'::interval * LEAST(50, GREATEST(0, 60 - c.level)))
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
            // Attempt to get exclusive scheduler lock
            var lockValue = new Guid().ToString("N");
            var lockSuccess = await _jobRepository.AcquireLockAsync("scheduler", lockValue, TimeSpan.FromSeconds(TIMER_INTERVAL - 1));
            if (!lockSuccess)
            {
                _logger.Debug("Skipping scheduler, lock failed");
                return;
            }

            // Scheduled jobs run on an interval, see if any need to be started
            foreach (var scheduledJob in _scheduledJobs)
            {
                if (await _jobRepository.CheckLastTime("scheduled_job", scheduledJob.RedisKey, scheduledJob.Interval))
                {
                    _logger.Information("Queueing scheduled task {0}", scheduledJob.RedisKey);
                    await _jobRepository.AddJobAsync(scheduledJob.Priority, scheduledJob.Type);
                }
            }

            // Execute some sort of nasty database query to get characters that need an API check
            var characters = await _context.CharacterQuery.FromSqlRaw(QUERY_CHARACTERS).ToArrayAsync();
            if (characters.Length > 0)
            {
                // Queue character jobs
                _logger.Information("Queueing {0} character job(s)", characters.Length);
                var temp = characters.Select(c => new string[] { JsonConvert.SerializeObject(c) });
                await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.Character, temp);

                // Update ApiCheckTime
                var ids = characters.Select(s => s.CharacterId);
                await _context.PlayerCharacter.Where(c => ids.Contains(c.Id))
                    .UpdateAsync(c => new PlayerCharacter { LastApiCheck = DateTime.UtcNow });

                // Try some user checks I guess
                // TODO clean this mess up
                var distinctUsers = characters.DistinctBy(c => c.UserId).ToArray();
                var db = _redis.GetDatabase();
                var cached = await db.SaneGetValuesAsync(distinctUsers.Select(u => $"user:{u.UserId}:collections").ToArray());

                // This ends up being distinct UserIds that don't have a redis key set
                var yikes = distinctUsers.Select((q, index) => (q, index))
                    .Where(t => string.IsNullOrEmpty(cached[t.index]))
                    .Select(t => t.q.UserId);
                
                temp = yikes.Select(y => new string[] { y.ToString() });
                await _jobRepository.AddJobsAsync(JobPriority.Low, JobType.Collections, temp);

                await db.SaneSetValuesAsync(yikes.Select(y => $"user:{y}:collections"), "whee", TimeSpan.FromMinutes(10));
            }

            // Release exclusive scheduler lock
            await _jobRepository.ReleaseLockAsync("scheduler", lockValue);
        }
    }
}
