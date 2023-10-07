using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Wowthing.Backend.Models.Cache;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Services;

public class MemoryCacheService
{
    private readonly ILogger _logger;
    private readonly IMemoryCache _memoryCache;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public MemoryCacheService(
        IMemoryCache memoryCache,
        IServiceScopeFactory serviceScopeFactory
    )
    {
        _memoryCache = memoryCache;
        _serviceScopeFactory = serviceScopeFactory;

        _logger = Log.ForContext("Service", $"MemoryCache");
    }

    public async Task<ItemBonusCache> GetItemBonuses()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.ItemBonuses,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var itemBonuses = await contextWrapper.Context.WowItemBonus
                    .AsNoTracking()
                    .ToArrayAsync();

                return new ItemBonusCache(itemBonuses);
            }
        );
    }

    public async Task<ItemModifiedAppearanceCache> GetItemModifiedAppearances()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.ItemModifiedAppearances,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var itemModifiedAppearances = await contextWrapper.Context.WowItemModifiedAppearance
                    .AsNoTracking()
                    .ToArrayAsync();

                return new ItemModifiedAppearanceCache(itemModifiedAppearances);
            }
        );
    }

    public async Task<Dictionary<string, int>> GetJournalInstanceMap()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.JournalInstanceMap,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                // Fetch instance data for lockouts
                var instances = await contextWrapper.Context.LanguageString
                    .AsNoTracking()
                    .Where(ls => ls.Type == StringType.WowJournalInstanceMapName)
                    .ToArrayAsync();

                var ret = new Dictionary<string, int>();
                foreach (var instance in instances)
                {
                    ret[instance.String] = instance.Id;
                }

                return ret;
            }
        );
    }

    public async Task<Dictionary<(WowRegion, string), WowRealm>> GetRealmMap()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.WowRealmMap,
            async cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var realmMap = await contextWrapper.Context.WowRealm
                    .AsNoTracking()
                    .ToDictionaryAsync(wr => (wr.Region, wr.Name));

                foreach (var ((region, realmName), realm) in realmMap.ToArray())
                {
                    // Index by slug too
                    realmMap[(region, realm.Slug)] = realm;

                    // Fix some cases of realms being "KulTiras" in addon data but "Kul Tiras" here
                    if (realmName.Contains(' '))
                    {
                        realmMap[(region, realmName.Replace(" ", ""))] = realmMap[(region, realmName)];
                    }
                }

                return realmMap;
            }
        );
    }

    public async Task<long> GetTrustedRole()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.TrustedRole,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var trustedRole = contextWrapper.Context.Roles
                    .Where(r => r.Name == "Trusted")
                    .Select(r => r.Id)
                    .First();

                return Task.FromResult(trustedRole);
            }
        );
    }

    private class ContextWrapper : IDisposable
    {
        public readonly WowDbContext Context;
        private readonly IServiceScope _scope;

        public ContextWrapper(IServiceScopeFactory serviceScopeFactory)
        {
            _scope = serviceScopeFactory.CreateScope();
            var contextFactory = _scope.ServiceProvider
                .GetService<IDbContextFactory<WowDbContext>>();
            Context = contextFactory!.CreateDbContext();
        }

        public void Dispose()
        {
            Context?.Dispose();
            _scope?.Dispose();
        }
    }
}
