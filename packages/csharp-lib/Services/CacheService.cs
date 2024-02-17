using System.Text.Json;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.API;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.User;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Services;

public class CacheService
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(15);

    private readonly IConnectionMultiplexer _redis;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public CacheService(
        IConnectionMultiplexer redis,
        JsonSerializerOptions jsonSerializerOptions
    )
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _redis = redis;
    }

    public async Task<DateTimeOffset> GetLastModified(string key, ApiUserResult apiUserResult)
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(key, apiUserResult.User.Id);
        return await db.DateTimeOffsetGetAsync(redisKey);
    }

    public async Task<DateTimeOffset> SetLastModified(string key, long userId)
    {
        var db = _redis.GetDatabase();
        string redisKey = string.Format(key, userId);
        var now = DateTimeOffset.UtcNow;
        await db.DateTimeOffsetSetAsync(redisKey, now);

        if (key.Contains(":last_modified"))
        {
            await db.PublishAsync(RedisKeys.UserUpdatesChannel,
                $"{userId}|{redisKey.Split(':').Last()}|{now.ToUnixTimeSeconds()}");
        }

        return now;
    }

    public async Task<(bool, DateTimeOffset)> CheckLastModified(
        string cacheKey,
        // HttpRequest request,
        object idk,
        ApiUserResult apiUserResult
    )
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(cacheKey, apiUserResult.User.Id);
        var lastModified = await db.DateTimeOffsetGetAsync(redisKey);

        if (lastModified == DateTimeOffset.MinValue)
        {
            lastModified = DateTimeOffset.UtcNow;
            await db.DateTimeOffsetSetAsync(redisKey, lastModified, CommandFlags.FireAndForget);
        }

        // var headers = request?.GetTypedHeaders();
        // if (headers?.IfModifiedSince != null && lastModified <= headers.IfModifiedSince)
        // {
        //     return (false, lastModified);
        // }

        return (true, lastModified);
    }

    #region Achievements
    public async Task<(string, DateTimeOffset)> GetOrCreateAchievementCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset lastModified
    )
    {
        var db = _redis.GetDatabase();

        string json = await db.CompressedStringGetAsync(string.Format(RedisKeys.UserAchievements, userId));
        if (string.IsNullOrEmpty(json))
        {
            (json, lastModified) = await CreateAchievementCacheAsync(context, db, timer, userId);
        }

        return (json, lastModified);
    }

    public async Task<(string, DateTimeOffset)> CreateAchievementCacheAsync(
        WowDbContext context,
        IDatabase db,
        JankTimer timer,
        long userId
    )
    {
        var achievementsCompleted = await context.CompletedAchievementsQuery
            .FromSqlRaw(CompletedAchievementsQuery.UserQuery, userId)
            .ToDictionaryAsync(
                caq => caq.AchievementId,
                caq => caq.Timestamp
            );

        timer.AddPoint("Achievements");

        var criterias = await context.PlayerCharacterAchievements
            .AsNoTracking()
            .Where(pca => pca.Character.Account.UserId == userId)
            .Select(pca => new
            {
                pca.CharacterId,
                pca.CriteriaAmounts,
                pca.CriteriaIds,
            })
            .ToArrayAsync();

        timer.AddPoint("Criteria1b");

        var groupedCriteria = new Dictionary<int, Dictionary<int, List<int>>>();
        foreach (var characterCriteria in criterias.EmptyIfNull())
        {
            if (characterCriteria.CriteriaAmounts == null || characterCriteria.CriteriaIds == null)
            {
                continue;
            }

            for (int i = 0; i < characterCriteria.CriteriaIds.Count; i++)
            {
                int criteriaAmount = (int)characterCriteria.CriteriaAmounts[i];
                if (criteriaAmount == 0)
                {
                    continue;
                }

                int criteriaId = characterCriteria.CriteriaIds[i];
                if (!groupedCriteria.ContainsKey(criteriaId))
                {
                    groupedCriteria[criteriaId] = new();
                }

                if (!groupedCriteria[criteriaId].ContainsKey(criteriaAmount))
                {
                    groupedCriteria[criteriaId][criteriaAmount] = new();
                }

                groupedCriteria[criteriaId][criteriaAmount].Add(characterCriteria.CharacterId);
            }
        }

        timer.AddPoint("Criteria2b");

        var statistics = await context.StatisticsQuery
            .FromSqlRaw(StatisticsQuery.UserQuery, userId)
            .ToArrayAsync();

        timer.AddPoint("Statistics");

        var addonAchievements = await context.PlayerCharacterAddonAchievements
            .AsNoTracking()
            .Where(pcaa => pcaa.Character.Account.UserId == userId)
            .ToDictionaryAsync(
                pcaa => pcaa.CharacterId,
                pcaa => pcaa.Achievements
            );

        timer.AddPoint("AddonAchievements");

        // Build response
        string json = JsonSerializer.Serialize(new ApiUserAchievements
        {
            Achievements = achievementsCompleted,
            AddonAchievements = addonAchievements,
            RawCriteria = groupedCriteria,
            Statistics = statistics
                .ToGroupedDictionary(stat => stat.StatisticId),
        }, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);

        await db.CompressedStringSetAsync(string.Format(RedisKeys.UserAchievements, userId), json, CacheDuration);
        var lastModified = await SetLastModified(RedisKeys.UserLastModifiedAchievements, userId);

        timer.AddPoint("Redis");

        return (json, lastModified);
    }

    public async Task DeleteAchievementCacheAsync(long userId, IDatabase db = null)
    {
        db ??= _redis.GetDatabase();
        await db.KeyDeleteAsync(string.Format(RedisKeys.UserAchievements, userId));
        await SetLastModified(RedisKeys.UserLastModifiedAchievements, userId);
    }
    #endregion

    #region Mounts
    public async Task<UserCache> CreateOrUpdateMountCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset? lastModified = null,
        UserCache userCache = null
    )
    {
        userCache ??= await context.UserCache
            .Where(utc => utc.UserId == userId)
            .SingleOrDefaultAsync();

        if (userCache == null)
        {
            userCache = new UserCache(userId);
            context.UserCache.Add(userCache);
        }
        else if (lastModified.HasValue && lastModified <= userCache.MountsUpdated)
        {
            return userCache;
        }

        bool forceUpdate = userCache.MountsUpdated == DateTimeOffset.MinValue ||
                           (lastModified.HasValue && lastModified > userCache.MountsUpdated);
        var now = DateTimeOffset.UtcNow;

        // Mounts
        var mounts = await context.MountQuery
            .FromSqlRaw(MountQuery.UserQuery, userId)
            .SingleAsync();

        var sortedMountIds = mounts.AddonMounts.EmptyIfNull()
            .Union(mounts.Mounts.EmptyIfNull())
            .Select(id => (short)id)
            .Distinct()
            .Order()
            .ToList();

        timer.AddPoint("QueryMounts");

        if (forceUpdate || userCache.MountIds == null || !sortedMountIds.SequenceEqual(userCache.MountIds))
        {
            userCache.MountsUpdated = now;
            userCache.MountIds = sortedMountIds;

            await context.SaveChangesAsync();
            timer.AddPoint("SaveMounts");
        }

        return userCache;
    }
    #endregion

    #region RaiderIO
    public async Task<Dictionary<int, RedisRaiderIoScoreTiers>> GetRaiderIoTiers()
    {
        var db = _redis.GetDatabase();
        var raiderIoScoreTiers = await db.JsonGetAsync<Dictionary<int, RedisRaiderIoScoreTiers>>("raider_io_tiers");
        return raiderIoScoreTiers ?? new Dictionary<int, RedisRaiderIoScoreTiers>();
    }
    #endregion

    #region Quests
    public async Task<(string, DateTimeOffset)> GetOrCreateQuestCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset lastModified,
        UserCache userCache = null
    )
    {
        var db = _redis.GetDatabase();

        string json = await db.CompressedStringGetAsync(string.Format(RedisKeys.UserQuests, userId));
        if (string.IsNullOrEmpty(json))
        {
            (json, lastModified) = await CreateQuestCacheAsync(context, db, timer, userId, userCache);
        }

        return (json, lastModified);
    }

    public async Task<(string, DateTimeOffset)> CreateQuestCacheAsync(
        WowDbContext context,
        IDatabase db,
        JankTimer timer,
        long userId,
        UserCache userCache = null
    )
    {
        var accountAddonQuests = await context.PlayerAccountAddonData
            .AsNoTracking()
            .Where(ad => ad.Account.UserId == userId)
            .Select(ad => ad.Quests)
            .ToArrayAsync();

        var accountQuests = accountAddonQuests
            .SelectMany(ad => ad.EmptyIfNull())
            .Distinct()
            .ToArray();

        var characters = await context.PlayerCharacter
            .AsNoTracking()
            .Where(pc => pc.Account.UserId == userId)
            .Include(pc => pc.AddonQuests)
            .Include(pc => pc.Quests)
            .Select(pc => new
            {
                pc.Id,
                pc.AddonQuests,
                pc.Quests,
            })
            .ToArrayAsync();

        var characterData = characters.ToDictionary(
            c => c.Id,
            c => new ApiUserQuestsCharacter(
                c.AddonQuests,
                SerializationUtilities.AsDiffedList(
                    (c.Quests?.CompletedIds ?? []).Union(c.AddonQuests?.OtherQuests ?? [])
                )
            )
        );

        timer.AddPoint("Database");

        // Build response
        var data = new ApiUserQuests
        {
            Account = accountQuests,
            Characters = characterData,
        };

        var options = new JsonSerializerOptions(_jsonSerializerOptions)
        {
            Converters =
            {
                new PlayerCharacterAddonQuestsProgressConverter(),
            },
        };

        string json = JsonSerializer.Serialize(data, options);

        timer.AddPoint("JSON");

        await db.CompressedStringSetAsync(string.Format(RedisKeys.UserQuests, userId), json, CacheDuration);
        var lastModified = await SetLastModified(RedisKeys.UserLastModifiedQuests, userId);

        timer.AddPoint("Redis");

        // Update user cache
        userCache ??= await context.UserCache
            .Where(utc => utc.UserId == userId)
            .SingleOrDefaultAsync();

        if (userCache == null)
        {
            userCache = new UserCache(userId);
            context.UserCache.Add(userCache);
        }

        userCache.CompletedQuests = characters
            .SelectMany(pc => pc.Quests?.CompletedIds ?? new List<int>())
            .Distinct()
            .Count();

        await context.SaveChangesAsync();

        timer.AddPoint("Cache", true);

        return (json, lastModified);
    }

    public async Task DeleteQuestCacheAsync(long userId, IDatabase db = null)
    {
        db ??= _redis.GetDatabase();
        await db.KeyDeleteAsync(string.Format(RedisKeys.UserQuests, userId));
        await SetLastModified(RedisKeys.UserLastModifiedQuests, userId);
    }
    #endregion

    #region Toys
    public async Task<UserCache> CreateOrUpdateToyCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset? lastModified = null,
        UserCache userCache = null
    )
    {
        userCache ??= await context.UserCache
            .Where(utc => utc.UserId == userId)
            .SingleOrDefaultAsync();

        if (userCache == null)
        {
            userCache = new UserCache(userId);
            context.UserCache.Add(userCache);
        }
        else if (lastModified.HasValue && lastModified <= userCache.ToysUpdated)
        {
            return userCache;
        }

        bool forceUpdate = userCache.ToysUpdated == DateTimeOffset.MinValue ||
                           (lastModified.HasValue && lastModified > userCache.ToysUpdated);
        var now = DateTimeOffset.UtcNow;

        // Toys
        var accountToys = await context.PlayerAccountToys
            .Where(pat => pat.Account.UserId == userId)
            .ToArrayAsync();

        var sortedToyIds = accountToys
            .SelectMany(pat => pat.ToyIds.EmptyIfNull())
            .Distinct()
            .Select(id => (short)id)
            .Order()
            .ToList();

        timer.AddPoint("QueryToys");

        if (forceUpdate || userCache.ToyIds == null || !sortedToyIds.SequenceEqual(userCache.ToyIds))
        {
            userCache.ToysUpdated = now;
            userCache.ToyIds = sortedToyIds;

            await context.SaveChangesAsync();

            timer.AddPoint("SaveToys");
        }

        return userCache;
    }
    #endregion

    #region Transmog
    public async Task<UserCache> CreateOrUpdateTransmogCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset? lastModified = null,
        UserCache userCache = null
    )
    {
        userCache ??= await context.UserCache
            .Where(utc => utc.UserId == userId)
            .SingleOrDefaultAsync();

        if (userCache == null)
        {
            userCache = new UserCache(userId);
            context.UserCache.Add(userCache);
        }
        else if (lastModified.HasValue && lastModified <= userCache.TransmogUpdated)
        {
            return userCache;
        }

        bool forceUpdate = userCache.TransmogUpdated == DateTimeOffset.MinValue ||
                           lastModified.HasValue && lastModified > userCache.TransmogUpdated;
        var now = DateTimeOffset.UtcNow;

        var allTransmog = await context.AccountTransmogQuery
            .FromSqlRaw(AccountTransmogQuery.Sql, userId)
            .SingleAsync();

        var accountSources = await context.PlayerAccountTransmogSources
            .AsNoTracking()
            .Where(pats => pats.Account.UserId == userId)
            .ToArrayAsync();

        timer.AddPoint("Select");

        var allSources = new HashSet<string>();
        foreach (var sources in accountSources)
        {
            allSources.UnionWith(sources.Sources.EmptyIfNull());
        }

        var sortedAppearanceIds = allTransmog.TransmogIds
            .Distinct()
            .Order()
            .ToList();

        if (forceUpdate || userCache.AppearanceIds == null || !sortedAppearanceIds.SequenceEqual(userCache.AppearanceIds))
        {
            userCache.TransmogUpdated = now;
            userCache.AppearanceIds = sortedAppearanceIds;
        }

        var sortedAppearanceSources = allSources
            .Select(source =>
            {
                string[] parts = source.Split('_');
                return ((long.Parse(parts[0]) * 1000) + int.Parse(parts[1]), source);
            })
            .OrderBy(tup => tup.Item1)
            .Select(tup => tup.Item2)
            .ToList();

        if (forceUpdate || userCache.AppearanceSources == null || !sortedAppearanceSources.SequenceEqual(userCache.AppearanceSources))
        {
            userCache.TransmogUpdated = now;
            userCache.AppearanceSources = sortedAppearanceSources;
        }

        var sortedIllusions = allTransmog.IllusionIds
            .Distinct()
            .Select(id => (short)id)
            .Order()
            .ToList();

        if (forceUpdate || userCache.IllusionIds == null || !sortedIllusions.SequenceEqual(userCache.IllusionIds))
        {
            userCache.TransmogUpdated = now;
            userCache.IllusionIds = sortedIllusions;
        }

        int updated = await context.SaveChangesAsync();

        timer.AddPoint("Save");

        if (updated > 0)
        {
            await SetLastModified(RedisKeys.UserLastModifiedGeneral, userId);
        }

        return userCache;
    }

    public async Task DeleteTransmogCacheAsync(WowDbContext context, long userId)
    {
        await context.UserCache
            .Where(uc => uc.UserId == userId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(uc => uc.TransmogUpdated, uc => DateTimeOffset.MinValue)
            );
    }
    #endregion
}
