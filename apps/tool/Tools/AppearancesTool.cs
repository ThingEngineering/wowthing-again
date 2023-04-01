using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Appearances;
using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Tools;

public class AppearancesTool
{
    private readonly JankTimer _timer = new();

    public async Task Run(params string[] data)
    {
        await using var context = ToolContext.GetDbContext();

        var appearances = await LoadAppearances();
        var itemsByIconId = await LoadItems();
        var modifiedAppearancesByAppearanceId = await LoadModifiedAppearances(context);
        var dbItemMap = await LoadWowItems(context);

        _timer.AddPoint("Load");

        var cacheData = new RedisAppearances();

        var temp = new Dictionary<string, Dictionary<int, RedisAppearanceData>>();
        foreach (var appearance in appearances)
        {
            if (!modifiedAppearancesByAppearanceId.TryGetValue(appearance.ID, out var modifiedAppearances))
            {
                ToolContext.Logger.Debug("No modifiedAppearances for appearance {id}", appearance.ID);
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

                // if (dbItem.Quality < WowQuality.Uncommon)
                // {
                //     continue;
                // }

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

        cacheData.RawAppearances = temp.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Values
                .OrderByDescending(rsad => rsad.Appearance.UiOrder)
                .ToList()
        );

        // foreach (var (appearanceId, modifiedAppearances) in modifiedAppearancesByAppearanceId)
        // {
        //     var items = itemsByIconId[appearancesById[appearanceId]];
        //
        //     ToolContext.Logger.Debug("{a} {mas}",
        //         appearanceId,
        //         string.Join(", ", modifiedAppearances.Select(ima => $"{ima.ItemId}:{ima.Modifier}")));
        //     ToolContext.Logger.Debug("{i}",
        //         string.Join(", ", items.Select(item => item.ID)));
        // }

        var cacheJson = ToolContext.SerializeJson(cacheData);
        var cacheHash = cacheJson.Md5();

        var db = ToolContext.Redis.GetDatabase();
        await db.SetCacheDataAndHash("appearance", cacheJson, cacheHash);

        _timer.AddPoint("Cache", true);

        ToolContext.Logger.Information("{0}", _timer.ToString());
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

    private async Task<Dictionary<int, WowItemModifiedAppearance[]>> LoadModifiedAppearances(WowDbContext context)
    {
        var imas = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        return imas
            .ToGroupedDictionary(ima => ima.AppearanceId);
    }

    private async Task<Dictionary<int, WowItem>> LoadWowItems(WowDbContext context)
    {
        return await context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);
    }
}
