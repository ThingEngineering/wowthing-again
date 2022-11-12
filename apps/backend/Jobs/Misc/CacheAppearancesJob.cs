using Wowthing.Backend.Models.Data.Items;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheAppearancesJob : JobBase, IScheduledJob
{
    private readonly JankTimer _timer = new();

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.CacheAppearances,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 1,
    };

    public override async Task Run(params string[] data)
    {
        var appearances = await LoadAppearances();
        var itemsByIconId = await LoadItems();
        var modifiedAppearancesByAppearanceId = await LoadModifiedAppearances();
        var dbItemMap = await LoadWowItems();

        _timer.AddPoint("Load");

        var cacheData = new RedisStaticAppearances();

        var temp = new Dictionary<string, Dictionary<int, RedisStaticAppearanceData>>();
        foreach (var appearance in appearances)
        {
            if (!modifiedAppearancesByAppearanceId.TryGetValue(appearance.ID, out var modifiedAppearances))
            {
                Logger.Debug("No modifiedAppearances for appearance {id}", appearance.ID);
                continue;
            }

            //itemsByIconId.TryGetValue(appearance.DefaultIconFileDataID, out var iconItems);

            foreach (var modifiedAppearance in modifiedAppearances)
            {
                if (!dbItemMap.TryGetValue(modifiedAppearance.ItemId, out var dbItem))
                {
                    // Logger.Debug("No dbItem for item {id}", modifiedAppearance.ItemId);
                    continue;
                }

                if (dbItem.Quality < WowQuality.Uncommon)
                {
                    continue;
                }

                string key = $"{dbItem.Expansion}|{dbItem.ClassId}|{dbItem.SubclassId}|{(short)dbItem.InventoryType}";
                if (!temp.ContainsKey(key))
                {
                    temp[key] = new();
                }

                if (!temp[key].ContainsKey(appearance.ID))
                {
                    temp[key][appearance.ID] = new()
                    {
                        Appearance = appearance,
                    };
                }

                temp[key][appearance.ID].ModifiedAppearances.Add((modifiedAppearance, dbItem.Quality));
            }
        }

        cacheData.Appearances = temp.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Values
                .OrderByDescending(rsad => rsad.Appearance.UiOrder)
                .ToList()
        );

        // foreach (var (appearanceId, modifiedAppearances) in modifiedAppearancesByAppearanceId)
        // {
        //     var items = itemsByIconId[appearancesById[appearanceId]];
        //
        //     Logger.Debug("{a} {mas}",
        //         appearanceId,
        //         string.Join(", ", modifiedAppearances.Select(ima => $"{ima.ItemId}:{ima.Modifier}")));
        //     Logger.Debug("{i}",
        //         string.Join(", ", items.Select(item => item.ID)));
        // }

        var cacheJson = JsonConvert.SerializeObject(cacheData);
        var cacheHash = cacheJson.Md5();

        var db = Redis.GetDatabase();
        await db.SetCacheDataAndHash("appearance", cacheJson, cacheHash);

        _timer.AddPoint("Cache", true);

        Logger.Information("{0}", _timer.ToString());
    }

    private async Task<List<DumpItemAppearance>> LoadAppearances()
    {
        return await DataUtilities.LoadDumpCsvAsync<DumpItemAppearance>("itemappearance");
    }

    private async Task<Dictionary<int, DumpItem[]>> LoadItems()
    {
        var items = await DataUtilities.LoadDumpCsvAsync<DumpItem>("item");
        return items
            .ToGroupedDictionary(item => item.IconFileDataID);
    }

    private async Task<Dictionary<int, WowItemModifiedAppearance[]>> LoadModifiedAppearances()
    {
        var imas = await Context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        return imas
            .ToGroupedDictionary(ima => ima.AppearanceId);
    }

    private async Task<Dictionary<int, WowItem>> LoadWowItems()
    {
        return await Context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);
    }
}
