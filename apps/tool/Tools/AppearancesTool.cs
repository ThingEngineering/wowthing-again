using Serilog.Context;
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
        using var foo = LogContext.PushProperty("Task", "Appearances");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading data...");

        var appearances = await LoadAppearances();
        var itemsByIconId = await LoadItems();
        var modifiedAppearancesByAppearanceId = await LoadModifiedAppearances(context);
        var dbItemMap = await LoadWowItems(context);

        _timer.AddPoint("Load");

        ToolContext.Logger.Information("Generating...");

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

            var byItemId = new Dictionary<int, int[]>();
            foreach (var modifiedAppearance in modifiedAppearances)
            {
                if (!dbItemMap.TryGetValue(modifiedAppearance.ItemId, out var dbItem))
                {
                    // Logger.Debug("No dbItem for item {id}", modifiedAppearance.ItemId);
                    continue;
                }

                string key = $"{dbItem.Expansion}|{dbItem.ClassId}|{dbItem.SubclassId}|{(short)dbItem.InventoryType}";
                if (!temp.TryGetValue(key, out var keyData))
                {
                    keyData = temp[key] = new();
                }

                if (!keyData.TryGetValue(appearance.ID, out var appearanceData))
                {
                    appearanceData = temp[key][appearance.ID] = new()
                    {
                        Appearance = appearance,
                    };
                }

                appearanceData.ModifiedAppearances.Add((modifiedAppearance, dbItem.Quality));
            }
        }

        cacheData.RawAppearances = temp.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Values
                .OrderByDescending(rad => rad.ModifiedAppearances.Min(ma => ma.Item1.ItemId))
                .ThenBy(rad => Hardcoded.ItemModifierSortOrder.GetValueOrDefault(rad.ModifiedAppearances.First().Item1.Modifier))
                // .OrderByDescending(rsad => rsad.ModifiedAppearances.First().Item1.AppearanceId)
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

        _timer.AddPoint("Generate", true);

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
