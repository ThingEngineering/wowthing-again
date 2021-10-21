using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Context;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public class WorkerService : BackgroundService
    {
        private static int _instanceCount;
        private static readonly Dictionary<JobType, Type> JobTypeToClass = new();

        private readonly ILogger _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly JobFactory _jobFactory;
        private readonly JobPriority _priority;
        private readonly StateService _stateService;

        public WorkerService(
            JobPriority priority,
            IConfiguration config, 
            IHttpClientFactory clientFactory, 
            IServiceScopeFactory serviceScopeFactory,
            JobRepository jobRepository, 
            StateService stateService
        )
        {
            _priority = priority;
            _serviceScopeFactory = serviceScopeFactory;
            _stateService = stateService;

            var instanceId = Interlocked.Increment(ref _instanceCount);
            _logger = Log.ForContext("Service", $"Worker {instanceId,2}{_priority.ToString()[0]}");

            var redisConnectionString = config.GetConnectionString("Redis");
            _jobFactory = new JobFactory(clientFactory, _logger, jobRepository, stateService, redisConnectionString);
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
                var typeName = jobType.Name[0..^3];
                JobTypeToClass[Enum.Parse<JobType>(typeName)] = jobType;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            _logger.Information("Service starting");
            
            // Give things a chance to get organized
            await Task.Delay(2000, cancellationToken);

            await foreach (var result in _stateService.JobQueueReaders[_priority].ReadAllAsync(cancellationToken))
            {
                while (_stateService.AccessToken?.Valid != true)
                {
                    _logger.Warning("Waiting for auth service to be ready");
                    await Task.Delay(1000, cancellationToken);
                }

                var classType = JobTypeToClass[result.Type];
                using (LogContext.PushProperty("Task", classType.Name[0..^3]))
                {
                    IJob job;
                    try
                    {
                        using var scope = _serviceScopeFactory.CreateScope();
                        var contextFactory = scope.ServiceProvider.GetService<IDbContextFactory<WowDbContext>>();
                        if (contextFactory == null)
                        {
                            _logger.Error("contextFactory is null??");
                            continue;
                        }

                        await using var context = contextFactory.CreateDbContext();

                        job = _jobFactory.Create(classType, context, cancellationToken);
                        await job.Run(result.Data);
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(ex, "Job failed");
                    }
                }
            }
        }
    }
}
