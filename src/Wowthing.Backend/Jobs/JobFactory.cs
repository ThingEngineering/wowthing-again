using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using StackExchange.Redis;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs
{
    public class JobFactory
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly JobRepository _jobRepository;
        private readonly ILogger _logger;
        private readonly IConnectionMultiplexer _redis;
        private readonly StateService _stateService;

        public JobFactory(JobRepository jobRepository, IHttpClientFactory clientFactory, ILogger logger, IConnectionMultiplexer redis, StateService stateService)
        {
            _clientFactory = clientFactory;
            _jobRepository = jobRepository;
            _logger = logger;
            _redis = redis;
            _stateService = stateService;
        }

        public IJob Create(Type type, WowDbContext context, CancellationToken cancellationToken)
        {
            var obj = (JobBase)Activator.CreateInstance(type);
            obj._http = _clientFactory.CreateClient("limited");
            obj._jobRepository = _jobRepository;
            obj._logger = _logger;
            obj._redis = _redis;
            obj._stateService = _stateService;
            obj._context = context;
            obj._cancellationToken = cancellationToken;
            return obj;
        }
    }
}
