using Serilog.Context;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Tools;

public class ItemsTool
{
    private readonly JankTimer _timer = new();
    private Dictionary<int, WowItemBonus> _itemBonusMap;

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Items");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading data...");

        var items = await context.WowItem
            .AsNoTracking()
            .ToArrayAsync();

        _itemBonusMap = await context.WowItemBonus
            .ToDictionaryAsync(wib => wib.Id);

        var modifiedAppearances = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        var itemToModifiedAppearances = modifiedAppearances
            .ToGroupedDictionary(ima => ima.ItemId);

        var strings = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(
                ls => (ls.Language, ls.Id),
                ls => ls.String
            );

        _timer.AddPoint("Database");

        var listGroups = await LoadItemBonusListGroups(context);

        _timer.AddPoint("File");

        var db = ToolContext.Redis.GetDatabase();

        var cacheData = new RedisItems
        {
            ItemBonusListGroups = listGroups,
            RawItemBonuses = _itemBonusMap.Values.ToArray(),
        };
        string? cacheHash = null;

        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {Lang}...", language);

            cacheData.RawItems = items.Select(item => new RedisItemData(item)
                {
                    Appearances = itemToModifiedAppearances.GetValueOrDefault(item.Id, Array.Empty<WowItemModifiedAppearance>()),
                    Name = strings.GetValueOrDefault((language, item.Id), $"Item #{item.Id}"),
                })
                .ToArray();

            string cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"item-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Generate", true);
        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private async Task<Dictionary<int, Dictionary<int, List<int>>>> LoadItemBonusListGroups(WowDbContext context)
    {
        var entries = await DataUtilities.LoadDumpCsvAsync<DumpItemBonusListGroupEntry>("itembonuslistgroupentry");
        // Flag 0x1 = hidden maybe?
        var grouped = entries
            .Where(entry => (entry.Flags & 0x1) == 0)
            .GroupBy(entry => entry.ItemBonusListGroupID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(entry => entry.SequenceValue)
                    .Select(entry => entry.ItemBonusListID)
                    .ToArray()
            );

        var groupedBySharedString = new Dictionary<int, Dictionary<int, List<int>>>();
        foreach ((int bonusGroupId, int[] group) in grouped)
        {
            groupedBySharedString[bonusGroupId] = new();

            foreach (int itemBonusId in group)
            {
                foreach (var bonusData in _itemBonusMap[itemBonusId].Bonuses)
                {
                    // Bonus type 34, ItemBonusListGroupID, SharedStringID?
                    if (bonusData[0] == 34 && bonusData.Count >= 3)
                    {
                        int sharedStringId = bonusData[2];
                        if (!groupedBySharedString[bonusGroupId].TryGetValue(sharedStringId, out var oof))
                        {
                            oof = groupedBySharedString[bonusGroupId][sharedStringId] = new();
                        }

                        oof.Add(itemBonusId);
                        break;
                    }
                }
            }
        }

        return groupedBySharedString;
    }
}
