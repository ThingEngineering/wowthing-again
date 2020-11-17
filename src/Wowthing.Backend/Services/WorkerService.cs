using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Backend.Jobs;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public class WorkerService : BackgroundService
    {
        private static int _instanceCount;
        private static readonly Dictionary<JobType, Type> _jobTypeToClass = new Dictionary<JobType, Type>();

        private readonly int _instanceId;
        private readonly HttpClient _http;
        private readonly ILogger _logger;
        private readonly IServiceProvider _services;
        private readonly JobRepository _jobRepository;
        private readonly StateService _stateService;

        public WorkerService(IServiceProvider services, StateService stateService, JobRepository jobRepository)
        {
            _services = services;
            _stateService = stateService;
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
                var typeName = jobType.Name[0..^3];
                _jobTypeToClass[Enum.Parse<JobType>(typeName)] = jobType;
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.Run(async () =>
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(500);
                if (_stateService.AccessToken?.RefreshRequired != false)
                {
                    _logger.Debug("Waiting for auth service to be ready");
                    continue;
                }

                var result = await _jobRepository.GetJobAsync();
                if (result == null)
                {
                    continue;
                }
                
                _logger.Debug("Got one! {@result}", result);

                using (var scope = _services.CreateScope())
                {
                    var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();

                    _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _stateService.AccessToken.AccessToken);
                    var job = (IJob)Activator.CreateInstance(_jobTypeToClass[result.Type], _http, _logger, userRepository);
                    try
                    {
                        await job.Run(result.Data);
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(ex, "Job failed");
                    }
                }

                // TODO:
                // - do things based on job
                //   - reflection to find jobs?
                //_logger.Debug("hello");
            }
        });
    }
}
