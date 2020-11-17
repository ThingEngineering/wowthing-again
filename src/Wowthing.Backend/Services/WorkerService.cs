using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    class WorkerService : BackgroundService
    {
        private static int _instanceCount;
        private static Dictionary<JobType, Type> _jobTypeToClass = new Dictionary<JobType, Type>();

        private readonly int _instanceId;
        private readonly HttpClient _http;
        private readonly ILogger _logger;
        private readonly JobRepository _jobRepository;

        public WorkerService(JobRepository jobRepository)
        {
            _jobRepository = jobRepository;

            _instanceId = Interlocked.Increment(ref _instanceCount);
            _http = new HttpClient();
            _logger = Log.ForContext("Service", $"Worker {_instanceId,2} | ");
        }

        // Find all jobs and cache them
        static WorkerService()
        {
            var jobTypes = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(a => a.GetTypes())
                .Where(t => t.IsClass && !t.IsAbstract && t.IsSubclassOf(typeof(JobBase)))
                .ToArray();
            foreach (var jobType in jobTypes)
            {
                var typeName = jobType.Name.Substring(0, jobType.Name.Length - 3);
                _jobTypeToClass[Enum.Parse<JobType>(typeName)] = jobType;
            }
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
                
                _logger.Debug("Got one! {@result}", result);

                var job = (IWorkerJob)Activator.CreateInstance(_jobTypeToClass[result.Type], _http, _logger, result.Data);
                await job.Run();

                // TODO:
                // - do things based on job
                //   - reflection to find jobs?
                //_logger.Debug("hello");
            }
        });
    }
}
