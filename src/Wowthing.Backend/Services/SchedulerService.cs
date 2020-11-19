using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public sealed class SchedulerService : TimerService
    {
        private readonly JobRepository _jobRepository;
        private readonly List<ScheduledJob> _scheduledJobs = new List<ScheduledJob>();

        public SchedulerService(JobRepository jobRepository)
            : base("Scheduler", TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(5))
        {
            _jobRepository = jobRepository;

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
            // TODO attempt to get scheduler lock - Redis SET NX EX something?
            //      Return if not our turn to schedule

            // Scheduled jobs run on an interval, see if any need to be started
            foreach (var scheduledJob in _scheduledJobs)
            {
                if (await _jobRepository.TestCheckTime(scheduledJob.Type.ToString(), scheduledJob.Interval))
                {
                    _logger.Information("Scheduled task {0} starting", scheduledJob.Type.ToString());
                    await _jobRepository.AddJobAsync(scheduledJob.Priority, scheduledJob.Type);
                }
            }

            // Schedule jobs:
            // - execute some sort of nasty database query to get characters that need checking
            // - queue jobs for each character
        }
    }
}
