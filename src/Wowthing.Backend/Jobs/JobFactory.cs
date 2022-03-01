using System.Net.Http;
using Serilog;
using StackExchange.Redis;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public class JobFactory
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;
        private readonly JobRepository _jobRepository;
        private readonly StateService _stateService;
        private readonly ConnectionMultiplexer _redis;

        public JobFactory(
            IHttpClientFactory clientFactory,
            ILogger logger,
            JobRepository jobRepository,
            StateService stateService,
            string redisConnectionString
        )
        {
            _clientFactory = clientFactory;
            _jobRepository = jobRepository;
            _logger = logger;
            _stateService = stateService;

            _redis = RedisUtilities.GetConnection(redisConnectionString);
        }

        public IJob Create(Type type, WowDbContext context, CancellationToken cancellationToken)
        {
            var obj = (JobBase)Activator.CreateInstance(type);
            obj.Http = _clientFactory.CreateClient("limited");
            obj.JobRepository = _jobRepository;
            obj.Logger = _logger;
            obj.Redis = _redis;
            obj.StateService = _stateService;
            obj.Context = context;
            obj.CancellationToken = cancellationToken;
            return obj;
        }
    }
}
