using System.Globalization;
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

    public async Task<Dictionary<int, long>> GetAuctionHouseUpdatedTimes()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.AuctionHouseUpdatedTimes,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);

                string[] tableNames = await _context.Database
                    .SqlQuery<string>($@"
SELECT  pgc.relname
FROM    pg_catalog.pg_inherits pgi
INNER JOIN pg_catalog.pg_class pgc ON pgi.inhrelid = pgc.oid
WHERE   pgi.inhparent = 'wow_auction'::regclass
").ToArrayAsync();

                var ret = new Dictionary<int, long>();
                foreach (string tableName in tableNames)
                {
                    string[] nameParts = tableName.Split('_');
                    int realmId = int.Parse(nameParts[2]);
                    long timestamp = ((DateTimeOffset)(DateTime.ParseExact(
                            nameParts[3],
                            "yyyyMMddHHmmss",
                            CultureInfo.InvariantCulture
                        ))).ToUnixTimeSeconds();
                    ret[realmId] = timestamp;
                }

                return ret;
            });
    }

    public async Task<Dictionary<int, BackgroundImage>> GetBackgroundImages()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.BackgroundImages,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                return _context.BackgroundImage
                    .AsNoTracking()
                    .Where(bi => bi.Role == null)
                    .ToDictionaryAsync(bi => bi.Id);
            }
        );
    }

    public async Task<Dictionary<int, WowPeriod>> GetPeriods()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.Periods,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                var currentPeriods = await _context.WowPeriod
                    .AsNoTracking()
                    .GroupBy(p => p.Region)
                    .ToDictionaryAsync(
                        group => (int)group.Key,
                        group => group
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

                return currentPeriods;
            }
        );
    }

    public async Task<(Dictionary<short, WowItemClass>, Dictionary<short, WowItemSubclass>)> GetItemClasses()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.ItemClasses,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                var itemClassMap = await _context.WowItemClass
                    .AsNoTracking()
                    .ToDictionaryAsync(wic => wic.Id);
                var itemSubclassMap = await _context.WowItemSubclass
                    .AsNoTracking()
                    .ToDictionaryAsync(wis => wis.Id);

                return (itemClassMap, itemSubclassMap);
            }
        );
    }

    public async Task<Dictionary<int, int>> GetItemIdToPetId()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.PetIds,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                var pets = await _context.WowPet
                    .AsNoTracking()
                    .Where(pet => (pet.Flags & 32) == 0 && pet.ItemIds.Count > 0)
                    .ToArrayAsync();
                return pets.ToManyDictionary(pet => pet.ItemIds, pet => pet.Id);
            }
        );
    }

    public async Task<Dictionary<int, Dictionary<int, int[]>>> GetProfessionRecipeItems()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.ProfessionRecipeItems,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                var recipeItems = await _context.WowProfessionRecipeItem
                    .AsNoTracking()
                    .ToArrayAsync();

                return recipeItems
                    .GroupBy(item => item.SkillLineId)
                    .ToDictionary(
                        group => group.Key,
                        group => group
                            .GroupBy(item => item.SkillLineAbilityId)
                            .ToDictionary(
                                group2 => group2.Key,
                                group2 => group2.Select(item => item.ItemId).ToArray()
                            )
                    );
            }
        );
    }

    public async Task<Dictionary<string, string>> GetCachedHashes()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.UserViewHashes,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);

                var db = _redis.GetDatabase();

                var achievementHash = db.StringGetAsync("cache:achievement-enUS:hash");
                var appearanceHash = db.StringGetAsync("cache:appearance:hash");
                var auctionHash = db.StringGetAsync("cache:auction-enUS:hash");
                var dbHash = db.StringGetAsync("cache:db-enUS:hash");
                var itemHash = db.StringGetAsync("cache:item-enUS:hash");
                var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
                var manualHash = db.StringGetAsync("cache:manual-enUS:hash");
                var staticHash = db.StringGetAsync("cache:static-enUS:hash");

                await Task.WhenAll(achievementHash, appearanceHash, auctionHash, dbHash, itemHash, journalHash,
                    manualHash, staticHash);

                return new Dictionary<string, string>
                {
                    { "Achievement", achievementHash.Result },
                    { "Appearance", appearanceHash.Result },
                    { "Auction", auctionHash.Result },
                    { "Db", dbHash.Result },
                    { "Item", itemHash.Result },
                    { "Journal", journalHash.Result },
                    { "Manual", manualHash.Result },
                    { "Static", staticHash.Result },
                };
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
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);
                return await _userManager.FindByNameAsync(username);
            }
        );
    }

    public async Task<string> GetUserModifiedJsonAsync(ApiUserResult apiResult)
    {
        return await _memoryCache.GetOrCreateAsync(
            string.Format(MemoryCacheKeys.UserModified, apiResult.User.NormalizedUserName),
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10);
                return await GetUserModifiedJsonTask(apiResult);
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
            ["transmog"] = _context.UserCache
                .Where(uc => uc.UserId == apiResult.User.Id)
                .Select(uc => new Tuple<bool, DateTimeOffset>(true, uc.TransmogUpdated).ToValueTuple())
                .FirstOrDefaultAsync(),
        };
        await Task.WhenAll(wait.Values.ToArray());

        var times = wait.ToDictionary(
            task => task.Key,
            task => Math.Max(0, task.Value.Result.Item2.ToUnixTimeSeconds())
        );
        return JsonSerializer.Serialize(times);
    }
}
