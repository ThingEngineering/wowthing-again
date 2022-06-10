using System.Security.Claims;
using Microsoft.AspNetCore.Http;
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

    public async Task<(bool, DateTimeOffset)> CheckLastModified(
        string cacheKey,
        HttpRequest request,
        ApiUserResult apiUserResult
    )
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(cacheKey, apiUserResult.User.Id);
        var lastModified = await db.DateTimeOffsetGetAsync(redisKey);

        if (lastModified == DateTimeOffset.MinValue)
        {
            lastModified = DateTimeOffset.UtcNow;
            await db.DateTimeOffsetSetAsync(redisKey, lastModified);
        }
        
        var headers = request.GetTypedHeaders();
        if (headers.IfModifiedSince.HasValue && lastModified <= headers.IfModifiedSince)
        {
            return (false, lastModified);
        }

        return (true, lastModified);
    }
}
