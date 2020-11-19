using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Extensions;
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

            // TODO better way of doing this
            ScheduleTask(JobType.DataPlayableClassIndex, JobPriority.High, TimeSpan.FromDays(1));
            ScheduleTask(JobType.DataPlayableRaceIndex, JobPriority.High, TimeSpan.FromDays(1));
            ScheduleTask(JobType.DataRealmIndex, JobPriority.High, TimeSpan.FromDays(1));
        }

        public void ScheduleTask(JobType jobType, JobPriority priority, TimeSpan interval)
        {
            _scheduledJobs.Add(new ScheduledJob
            {
                Type = jobType,
                Priority = priority,
                Interval = interval,
            });
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
