using System.Text.Json;
using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.API;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Services;

public class CacheService
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);

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

    public async Task<(bool, DateTimeOffset)> SetLastModified(string key, long userId)
    {
        var db = _redis.GetDatabase();
        var redisKey = string.Format(key, userId);
        var now = DateTimeOffset.UtcNow;
        return (await db.DateTimeOffsetSetAsync(redisKey, now), now);
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
        string json = System.Text.Json.JsonSerializer.Serialize(new ApiUserAchievements
        {
            Achievements = achievementsCompleted,
            AddonAchievements = addonAchievements,
            RawCriteria = groupedCriteria,
            Statistics = statistics
                .ToGroupedDictionary(stat => stat.StatisticId),
        }, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);

        await db.CompressedStringSetAsync(string.Format(RedisKeys.UserAchievements, userId), json, CacheDuration);
        var (_, lastModified) = await SetLastModified(RedisKeys.UserLastModifiedAchievements, userId);

        timer.AddPoint("Redis");

        return (json, lastModified);
    }
    #endregion

    #region Quests
    public async Task<(string, DateTimeOffset)> GetOrCreateQuestCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset lastModified
    )
    {
        var db = _redis.GetDatabase();

        string json = await db.CompressedStringGetAsync(string.Format(RedisKeys.UserQuests, userId));
        if (string.IsNullOrEmpty(json))
        {
            (json, lastModified) = await CreateQuestCacheAsync(context, db, timer, userId);
        }

        return (json, lastModified);
    }

    public async Task<(string, DateTimeOffset)> CreateQuestCacheAsync(
        WowDbContext context,
        IDatabase db,
        JankTimer timer,
        long userId
    )
    {
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
            c => new ApiUserQuestsCharacter
            {
                ScannedAt = c.AddonQuests?.QuestsScannedAt ?? MiscConstants.DefaultDateTime,
                Dailies = c.AddonQuests?.Dailies.EmptyIfNull(),
                DailyQuestList = c.AddonQuests?.DailyQuests ?? new List<int>(),
                QuestList = (c.Quests?.CompletedIds ?? new List<int>())
                    .Union(c.AddonQuests?.OtherQuests ?? new List<int>())
                    .Distinct()
                    .ToList(),
                ProgressQuests = c.AddonQuests?.ProgressQuests.EmptyIfNull(),
            }
        );

        timer.AddPoint("Database");

        // Build response
        var data = new ApiUserQuests
        {
            Characters = characterData,
        };
        var json = System.Text.Json.JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON");

        await db.CompressedStringSetAsync(string.Format(RedisKeys.UserQuests, userId), json, CacheDuration);
        var (_, lastModified) = await SetLastModified(RedisKeys.UserLastModifiedQuests, userId);

        timer.AddPoint("Redis", true);

        return (json, lastModified);
    }
    #endregion

    #region Transmog
    public async Task<(string, DateTimeOffset)> GetOrCreateTransmogCacheAsync(
        WowDbContext context,
        JankTimer timer,
        long userId,
        DateTimeOffset lastModified
    )
    {
        var db = _redis.GetDatabase();

        string json = await db.CompressedStringGetAsync(string.Format(RedisKeys.UserTransmog, userId));
        if (string.IsNullOrEmpty(json))
        {
            (json, lastModified) = await CreateTransmogCacheAsync(context, db, timer, userId);
        }

        return (json, lastModified);
    }

    public async Task<(string, DateTimeOffset)> CreateTransmogCacheAsync(
        WowDbContext context,
        IDatabase db,
        JankTimer timer,
        long userId
    )
    {
        var allTransmog = await context.AccountTransmogQuery
            .FromSqlRaw(AccountTransmogQuery.Sql, userId)
            .SingleAsync();

        var accountSources = await context.PlayerAccountTransmogSources
            .AsNoTracking()
            .Where(pats => pats.Account.UserId == userId)
            .ToArrayAsync();

        timer.AddPoint("Database");

        var allSources = new HashSet<string>();
        foreach (var sources in accountSources)
        {
            allSources.UnionWith(sources.Sources.EmptyIfNull());
        }

        var json = System.Text.Json.JsonSerializer.Serialize(new ApiUserTransmog
        {
            Illusions = allTransmog.IllusionIds
                .Distinct()
                .OrderBy(id => id)
                .ToArray(),

            Sources = allSources
                .OrderBy(source => source)
                .ToArray(),

            Transmog = allTransmog.TransmogIds
                .Distinct()
                .OrderBy(id => id)
                .ToArray(),
        }, _jsonSerializerOptions);

        timer.AddPoint("JSON");

        await db.CompressedStringSetAsync(string.Format(RedisKeys.UserTransmog, userId), json, CacheDuration);
        var (_, lastModified) = await SetLastModified(RedisKeys.UserLastModifiedTransmog, userId);

        timer.AddPoint("Redis", true);

        return (json, lastModified);
    }
    #endregion
}
