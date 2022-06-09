using System.Security.Claims;
using StackExchange.Redis;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Services;

public class CacheService
{
    private readonly IConnectionMultiplexer _redis;

    public CacheService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<DateTimeOffset> GetLastModified(string key, ApiUserResult apiUserResult)
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(key, apiUserResult.User.Id);
        return await db.DateTimeOffsetGetAsync(redisKey);
    }

    public async Task<bool> SetLastModified(string key, long userId)
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(key, userId);
        return await db.DateTimeOffsetSetAsync(redisKey, DateTimeOffset.UtcNow);
    }
}
