using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheItemsJob : JobBase, IScheduledJob
{
    private readonly JankTimer _timer = new();

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.CacheItems,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 1,
    };

    public override async Task Run(params string[] data)
    {
        var items = await Context.WowItem
            .AsNoTracking()
            .ToArrayAsync();

        var modifiedAppearances = await Context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        var itemToModifiedAppearances = modifiedAppearances
            .ToGroupedDictionary(ima => ima.ItemId);

        var strings = await Context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(
                ls => (ls.Language, ls.Id),
                ls => ls.String
            );

        _timer.AddPoint("Database");

        var db = Redis.GetDatabase();

        var cacheData = new RedisStaticItems();

        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            Logger.Information("{Lang}", language);

            cacheData.Items = items.Select(item => new RedisStaticItemsItem(item)
            {
                Appearances = itemToModifiedAppearances.GetValueOrDefault(item.Id, Array.Empty<WowItemModifiedAppearance>()),
                Name = strings.GetValueOrDefault((language, item.Id), $"Item #{item.Id}"),
            })
            .ToArray();

            var cacheJson = JsonConvert.SerializeObject(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await db.SetCacheDataAndHash($"item-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache", true);
        Logger.Information("{0}", _timer.ToString());
    }
}
