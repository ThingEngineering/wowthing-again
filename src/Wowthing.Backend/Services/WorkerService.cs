using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    class WorkerService : BackgroundService
    {
        private static int _instanceCount;

        private readonly int _instanceId;
        private readonly ILogger _logger;
        private readonly JobRepository _jobRepository;

        public WorkerService(JobRepository jobRepository)
        {
            _jobRepository = jobRepository;

            _instanceId = Interlocked.Increment(ref _instanceCount);
            _logger = Log.ForContext("Service", $"Worker {_instanceId,2} | ");
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.Run(async () =>
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(500);
                var result = await _jobRepository.GetJobAsync();
                if (result == null)
                {
                    continue;
                }
                
                _logger.Debug("Got one! {a} {b} {c}", result.Data, result.Priority, result.Type);

                // TODO:
                // - do things based on job
                //   - reflection to find jobs?
                //_logger.Debug("hello");
            }
        });
    }
}
