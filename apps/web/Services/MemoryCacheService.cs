using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Services;

namespace Wowthing.Web.Services;

public class MemoryCacheService
{
    private readonly CacheService _cacheService;
    private readonly IConnectionMultiplexer _redis;
    private readonly IMemoryCache _memoryCache;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public MemoryCacheService(
        CacheService cacheService,
        IConnectionMultiplexer redis,
        IMemoryCache memoryCache,
        UserManager<ApplicationUser> userManager,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _context = context;
        _memoryCache = memoryCache;
        _redis = redis;
        _userManager = userManager;
    }

    public async Task<Dictionary<int, BackgroundImage>> GetBackgroundImages()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.BackgroundImages,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                return _context.BackgroundImage
                    .Where(bi => bi.Role == null)
                    .ToDictionaryAsync(bi => bi.Id);
            }
        );
    }

    public async Task<Dictionary<int, WowPeriod>> GetPeriods()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.Periods,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                var currentPeriods = _context.WowPeriod
                    .AsEnumerable()
                    .GroupBy(p => p.Region)
                    .ToDictionary(
                        grp => (int)grp.Key,
                        grp => grp
                            .OrderByDescending(p => p.Starts)
                            .First()
                    );

                var now = DateTime.UtcNow;
                foreach (int region in currentPeriods.Keys)
                {
                    while (currentPeriods[region].Ends < now)
                    {
                        currentPeriods[region].Id++;
                        currentPeriods[region].Starts = currentPeriods[region].Starts.AddDays(7);
                        currentPeriods[region].Ends = currentPeriods[region].Ends.AddDays(7);
                    }
                }

                return Task.FromResult(currentPeriods);
            }
        );
    }

    public async Task<Dictionary<string, string>> GetCachedHashes()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.UserViewHashes,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);

                var db = _redis.GetDatabase();

                var achievementHash = db.StringGetAsync("cache:achievement-enUS:hash");
                var appearanceHash = db.StringGetAsync("cache:appearance:hash");
                var dbHash = db.StringGetAsync("cache:db-enUS:hash");
                var itemHash = db.StringGetAsync("cache:item-enUS:hash");
                var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
                var manualHash = db.StringGetAsync("cache:manual-enUS:hash");
                var staticHash = db.StringGetAsync("cache:static-enUS:hash");
                Task.WaitAll(achievementHash, appearanceHash, dbHash, itemHash, journalHash, manualHash, staticHash);

                return Task.FromResult(new Dictionary<string, string>
                {
                    { "Achievement", achievementHash.Result },
                    { "Appearance", appearanceHash.Result },
                    { "Db", dbHash.Result },
                    { "Item", itemHash.Result },
                    { "Journal", journalHash.Result },
                    { "Manual", manualHash.Result },
                    { "Static", staticHash.Result },
                });
            }
        );
    }

    public void ExpireUserByName(string username)
    {
        _memoryCache.Remove(string.Format(MemoryCacheKeys.User, username.ToLowerInvariant()));
    }

    public async Task<ApplicationUser?> FindUserByNameAsync(string username)
    {
        return await _memoryCache.GetOrCreateAsync(
            string.Format(MemoryCacheKeys.User, username.ToLowerInvariant()),
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);
                return _userManager.FindByNameAsync(username);
            }
        );
    }

    public async Task<string> GetUserModifiedJsonAsync(ApiUserResult apiResult)
    {
        return await _memoryCache.GetOrCreateAsync(
            string.Format(MemoryCacheKeys.UserModified, apiResult.User.NormalizedUserName),
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10);
                return GetUserModifiedJsonTask(apiResult);
            }
        );
    }

    private async Task<string> GetUserModifiedJsonTask(ApiUserResult apiResult)
    {
        var wait = new Dictionary<string, Task<(bool, DateTimeOffset)>>
        {
            ["achievements"] = _cacheService.CheckLastModified(RedisKeys.UserLastModifiedAchievements, null, apiResult),
            ["general"] = _cacheService.CheckLastModified(RedisKeys.UserLastModifiedGeneral, null, apiResult),
            ["quests"] = _cacheService.CheckLastModified(RedisKeys.UserLastModifiedQuests, null, apiResult),
            ["transmog"] = _cacheService.CheckLastModified(RedisKeys.UserLastModifiedTransmog, null, apiResult),
        };
        await Task.WhenAll(wait.Values.ToArray());

        var times = wait.ToDictionary(
            task => task.Key,
            task => task.Value.Result.Item2.ToUnixTimeSeconds()
        );
        string json = System.Text.Json.JsonSerializer.Serialize(times);
        return json;
    }
}
