using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Wowthing.Backend.Services
{
    public class SchedulerService : IHostedService, IDisposable
    {
        private ILogger<SchedulerService> _logger;
        private Timer _timer;

        public SchedulerService(ILogger<SchedulerService> logger)
        {
            _logger = logger;
        }

        #region IHostedService
        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Scheduler service starting");

            _timer = new Timer(TimerCallback, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Scheduler service stopping");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }
        #endregion

        #region IDisposable
        public void Dispose()
        {
            _timer?.Dispose();
        }
        #endregion

        private void TimerCallback(Object state)
        {
            _logger.LogInformation("Scheduler TimerCallback");

            // Attempt to get scheduler lock - Redis SET NX EX something?

            // Return if not our turn to schedule

            // Schedule jobs:
            // - execute some sort of nasty database query to get characters that need checking
            // - queue jobs for each character
        }
    }
}
