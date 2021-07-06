using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Wowthing.Backend.Services.Base
{
    public abstract class TimerService : IHostedService, IDisposable
    {
        protected readonly ILogger _logger;
        private readonly TimeSpan _initial;
        private readonly TimeSpan _interval;

        private Timer _timer;

        protected TimerService(string name, TimeSpan initial, TimeSpan interval)
        {
            _logger = Log.ForContext("Service", $"{name,-9} | ");
            _initial = initial;
            _interval = interval;
        }

        #region IHostedService
        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.Information("Service starting");

            _timer = new Timer(TimerCallback, null, _initial, _interval);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.Information("Service stopping");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }
        #endregion

        #region IDisposable
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _timer?.Dispose();
            }

        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion

        protected abstract void TimerCallback(object state);
    }
}
