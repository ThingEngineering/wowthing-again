using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Wowthing.Backend.Services
{
    public sealed class SchedulerService : TimerService
    {
        public SchedulerService() : base("Scheduler", TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(5))
        { }

        protected override void TimerCallback(object state)
        {
            //_logger.Information("TimerCallback");

            // Attempt to get scheduler lock - Redis SET NX EX something?

            // Return if not our turn to schedule

            // Schedule jobs:
            // - execute some sort of nasty database query to get characters that need checking
            // - queue jobs for each character
        }
    }
}
