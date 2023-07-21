﻿using Microsoft.Extensions.Caching.Memory;
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
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var itemBonuses = contextWrapper.Context.WowItemBonus
                    .AsNoTracking()
                    .ToArray();

                return Task.FromResult(new ItemBonusCache(itemBonuses));
            }
        );
    }

    public async Task<ItemModifiedAppearanceCache> GetItemModifiedAppearances()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.ItemModifiedAppearances,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var itemModifiedAppearances = contextWrapper.Context.WowItemModifiedAppearance
                    .AsNoTracking()
                    .ToArray();

                return Task.FromResult(new ItemModifiedAppearanceCache(itemModifiedAppearances));
            }
        );
    }

    public async Task<Dictionary<string, int>> GetJournalInstanceMap()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.JournalInstanceMap,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                // Fetch instance data for lockouts
                var instances = contextWrapper.Context.LanguageString
                    .AsNoTracking()
                    .Where(ls => ls.Type == StringType.WowJournalInstanceMapName)
                    .ToArray();

                var ret = new Dictionary<string, int>();
                foreach (var instance in instances)
                {
                    ret[instance.String] = instance.Id;
                }

                return Task.FromResult(ret);
            }
        );
    }

    public async Task<Dictionary<(WowRegion, string), WowRealm>> GetRealmMap()
    {
        return await _memoryCache.GetOrCreateAsync(
            MemoryCacheKeys.WowRealmMap,
            cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                using var contextWrapper = new ContextWrapper(_serviceScopeFactory);

                var realmMap = contextWrapper.Context.WowRealm
                    .AsNoTracking()
                    .ToDictionary(wr => (wr.Region, wr.Name));

                // Fix some cases of realms being "KulTiras" in addon data but "Kul Tiras" here
                foreach (var (region, realmName) in realmMap.Keys.ToArray())
                {
                    if (realmName.Contains(' '))
                    {
                        realmMap[(region, realmName.Replace(" ", ""))] = realmMap[(region, realmName)];
                    }
                }

                return Task.FromResult(realmMap);
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
