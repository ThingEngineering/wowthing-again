using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public sealed class SchedulerService : TimerService
    {
        private readonly JobRepository _jobRepository;

        public SchedulerService(JobRepository jobRepository)
            : base("Scheduler", TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(5))
        {
            _jobRepository = jobRepository;
        }

        protected override async void TimerCallback(object state)
        {
            // TODO don't hardcode this
            if (await _jobRepository.TestCheckTime("DataPlayableRacesJob", TimeSpan.FromHours(1)))
            {
                await _jobRepository.AddJobAsync(JobPriority.High, JobType.DataPlayableRaces);
            }

            //_logger.Information("TimerCallback");

            // Attempt to get scheduler lock - Redis SET NX EX something?

            // Return if not our turn to schedule

            // Schedule jobs:
            // - execute some sort of nasty database query to get characters that need checking
            // - queue jobs for each character
        }
    }
}
