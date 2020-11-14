using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Wowthing.Backend.Services
{
    class WorkerService : BackgroundService
    {
        private static int _instanceCount;

        private readonly int _instanceId;
        private readonly ILogger _logger;

        public WorkerService()
        {
            _instanceId = Interlocked.Increment(ref _instanceCount);
            _logger = Log.ForContext("Service", $"Worker {_instanceId,2} | ");
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.Run(async () =>
        {

            while (!stoppingToken.IsCancellationRequested)
            {

                //var thing = await 
                // TODO:
                // - request job from Redis
                // - do things based on job
                //   - reflection to find jobs?
                await Task.Delay(5000, stoppingToken);
                //_logger.Debug("hello");
            }
        });
    }
}
