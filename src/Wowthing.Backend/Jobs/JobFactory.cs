using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
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
        private readonly StateService _stateService;

        public JobFactory(HttpClient http, JobRepository jobRepository, ILogger logger, StateService stateService)
        {
            _http = http;
            _jobRepository = jobRepository;
            _logger = logger;
            _stateService = stateService;
        }

        public T Create<T>(IServiceScope serviceScope)
            where T : JobBase, new()
        {
            T obj = (T)Activator.CreateInstance(typeof(T), serviceScope);
            return obj;
        }

        public IJob Create(Type type, WowDbContext context)
        {
            var obj = (JobBase)Activator.CreateInstance(type);
            obj._http = _http;
            obj._jobRepository = _jobRepository;
            obj._logger = _logger;
            obj._stateService = _stateService;
            obj._context = context;
            return obj;
        }
    }
}
