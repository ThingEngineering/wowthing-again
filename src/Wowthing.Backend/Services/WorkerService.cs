﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using ServiceStack.Redis;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public class WorkerService : BackgroundService
    {
        private static int _instanceCount;
        private static readonly Dictionary<JobType, Type> _jobTypeToClass = new Dictionary<JobType, Type>();

        private readonly int _instanceId;
        private readonly IServiceProvider _services;
        private readonly StateService _stateService;

        private readonly JobRepository _jobRepository;
        private readonly ILogger _logger;

        private readonly JobFactory _jobFactory;

        public WorkerService(IServiceProvider services, IRedisClientsManager redis, JobRepository jobRepository, StateService stateService)
        {
            _services = services;
            _stateService = stateService;

            _instanceId = Interlocked.Increment(ref _instanceCount);
            _jobRepository = jobRepository;
            _logger = Log.ForContext("Service", $"Worker {_instanceId,2} | ");

            _jobFactory = new JobFactory(new HttpClient(), _jobRepository, _logger, redis, stateService);
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
                _jobTypeToClass[Enum.Parse<JobType>(typeName)] = jobType;
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.Run(async () =>
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetService<WowDbContext>();

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_stateService.AccessToken?.Valid != true)
                {
                    _logger.Debug("Waiting for auth service to be ready");
                    await Task.Delay(1000);
                    continue;
                }

                var result = await _jobRepository.GetJobAsync(stoppingToken);
                if (result == null)
                {
                    await Task.Delay(10);
                    continue;
                }

                _logger.Debug("Got one! {@result}", result);

                try
                {
                    var job = _jobFactory.Create(_jobTypeToClass[result.Type], context);
                    await job.Run(result.Data);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "Job failed");
                }
            }
        });
    }
}
