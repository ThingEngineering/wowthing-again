using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using ServiceStack.Redis;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs
{
    public class JobFactory
    {
        private readonly HttpClient _http;
        private readonly JobRepository _jobRepository;
        private readonly ILogger _logger;
        private readonly IRedisClientsManager _redis;
        private readonly StateService _stateService;

        public JobFactory(HttpClient http, JobRepository jobRepository, ILogger logger, IRedisClientsManager redis, StateService stateService)
        {
            _http = http;
            _jobRepository = jobRepository;
            _logger = logger;
            _redis = redis;
            _stateService = stateService;
        }

        public IJob Create(Type type, WowDbContext context)
        {
            var obj = (JobBase)Activator.CreateInstance(type);
            obj._http = _http;
            obj._jobRepository = _jobRepository;
            obj._logger = _logger;
            obj._redis = _redis;
            obj._stateService = _stateService;
            obj._context = context;
            return obj;
        }
    }
}
