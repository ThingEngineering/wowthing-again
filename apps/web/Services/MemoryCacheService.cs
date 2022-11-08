using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Services;

public class MemoryCacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IMemoryCache _memoryCache;
    private readonly UserManager<ApplicationUser> _userManager;

    public MemoryCacheService(
        IConnectionMultiplexer redis,
        IMemoryCache memoryCache,
        UserManager<ApplicationUser> userManager
    )
    {
        _memoryCache = memoryCache;
        _redis = redis;
        _userManager = userManager;
    }


    public async Task<Dictionary<string, string>> GetCachedHashes()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.UserViewHashes,
            cacheEntry =>
            {
                cacheEntry.SlidingExpiration = TimeSpan.FromMinutes(1);

                var db = _redis.GetDatabase();

                var achievementHash = db.StringGetAsync("cache:achievement-enUS:hash");
                var appearanceHash = db.StringGetAsync("cache:appearance:hash");
                var itemHash = db.StringGetAsync("cache:item-enUS:hash");
                var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
                var manualHash = db.StringGetAsync("cache:manual-enUS:hash");
                var staticHash = db.StringGetAsync("cache:static-enUS:hash");
                Task.WaitAll(achievementHash, appearanceHash, itemHash, journalHash, manualHash, staticHash);

                return Task.FromResult(new Dictionary<string, string>
                {
                    { "Achievement", achievementHash.Result },
                    { "Appearance", appearanceHash.Result },
                    { "Item", itemHash.Result },
                    { "Journal", journalHash.Result },
                    { "Manual", manualHash.Result },
                    { "Static", staticHash.Result },
                });
            }
        );
    }

    public async Task<ApplicationUser?> FindUserByNameAsync(string username)
    {
        return await _memoryCache.GetOrCreateAsync(
            string.Format(MemoryCacheKeys.User, username.ToLowerInvariant()),
            cacheEntry =>
            {
                cacheEntry.SlidingExpiration = TimeSpan.FromMinutes(1);
                return _userManager.FindByNameAsync(username);
            }
        );
    }
}
