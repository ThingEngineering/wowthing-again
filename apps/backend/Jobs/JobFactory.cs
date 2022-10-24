using System.Net.Http;
using System.Text.Json;
using Serilog;
using StackExchange.Redis;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs;

public class JobFactory
{
    private readonly Dictionary<Type, Func<object>> _constructorMap;
    private readonly Dictionary<Type, JobBase> _objectCache = new();

    private readonly CacheService _cacheService;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ILogger _logger;
    private readonly JobRepository _jobRepository;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly StateService _stateService;

    private readonly ConnectionMultiplexer _redis;

    public JobFactory(
        Dictionary<Type, Func<object>> constructorMap,
        CacheService cacheService,
        IHttpClientFactory clientFactory,
        ILogger logger,
        JobRepository jobRepository,
        JsonSerializerOptions jsonSerializerOptions,
        StateService stateService,
        string redisConnectionString)
    {
        _constructorMap = constructorMap;

        _cacheService = cacheService;
        _clientFactory = clientFactory;
        _jobRepository = jobRepository;
        _jsonSerializerOptions = jsonSerializerOptions;
        _logger = logger;
        _stateService = stateService;

        _redis = RedisUtilities.GetConnection(redisConnectionString);
    }

    public JobBase Create(Type type, WowDbContext context, CancellationToken cancellationToken)
    {
        if (!_objectCache.TryGetValue(type, out var obj))
        {
            obj = /*_objectCache[type] =*/ (JobBase)_constructorMap[type]();
            obj.CacheService = _cacheService;
            obj.JobRepository = _jobRepository;
            obj.JsonSerializerOptions = _jsonSerializerOptions;
            obj.Logger = _logger;
            obj.Redis = _redis;
            obj.StateService = _stateService;
        }

        obj.CancellationToken = cancellationToken;
        obj.Context = context;
        obj.Http = _clientFactory.CreateClient("limited");
        return obj;
    }

    public static void Reset(JobBase job)
    {
        job.CancellationToken = CancellationToken.None;

        job.Context?.Dispose();
        job.Context = null;

        job.Http?.Dispose();
        job.Http = null;
    }
}
