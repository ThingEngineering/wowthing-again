using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;

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
                if (await _jobRepository.CheckLastTime("scheduled_job", scheduledJob.Type.ToString(), scheduledJob.Interval))
                {
                    _logger.Information("Queueing scheduled task {0}", scheduledJob.Type.ToString());
                    await _jobRepository.AddJobAsync(scheduledJob.Priority, scheduledJob.Type);
                }
            }

            // TODO other jobs:
            // - execute some sort of nasty database query to get characters that need checking
            //var chars = await _context.PlayerCharacter.Where(c => c)

            // - queue jobs for each character
            // - store API checked time in redis or database?

            // Release exclusive scheduler lock
            await _jobRepository.ReleaseLockAsync("scheduler", lockValue);
        }
    }
}
