using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Services;

public class MemoryCacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IMemoryCache _memoryCache;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public MemoryCacheService(
        IConnectionMultiplexer redis,
        IMemoryCache memoryCache,
        UserManager<ApplicationUser> userManager,
        WowDbContext context
    )
    {
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
