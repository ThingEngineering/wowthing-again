using Microsoft.EntityFrameworkCore.Migrations.Operations;
using MoreLinq;
using Serilog.Context;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Tools;

public class ItemsTool
{
    private readonly JankTimer _timer = new();

    private Dictionary<int, WowItemBonus> _itemBonusMap;
    private Dictionary<(Language Language, int Id), string> _strings;

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Items");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading data...");

        var items = await context.WowItem
            .AsNoTracking()
            .OrderBy(item => item.Id)
            .ToArrayAsync();

        _itemBonusMap = await context.WowItemBonus
            .ToDictionaryAsync(wib => wib.Id);

        var itemEffects = await context.WowItemEffectV2.ToArrayAsync();

        var completesQuestMap = new Dictionary<int, List<int>>();
        foreach (var itemEffect in itemEffects)
        {
            foreach (var effectSpell in itemEffect.SpellEffects.Values)
            {
                foreach (var spellEffect in effectSpell.Values)
                {
                    if (spellEffect.Effect == WowSpellEffectEffect.CompleteQuest)
                    {
                        if (!completesQuestMap.TryGetValue(itemEffect.ItemId, out var questIds))
                        {
                            questIds = completesQuestMap[itemEffect.ItemId] = new();
                        }

                        questIds.Add(spellEffect.Values[0]);
                    }
                }
            }
        }

        var modifiedAppearances = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        var itemToModifiedAppearances = modifiedAppearances
            .ToGroupedDictionary(ima => ima.ItemId);

        _strings = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(
                ls => (ls.Language, ls.Id),
                ls => ls.String
            );

        _timer.AddPoint("Database");

        var listGroups = await LoadItemBonusListGroups(context);

        _timer.AddPoint("File");

        var indexClassIdSubclassIdInventoryType = items
            .CountBy(item => (item.ClassId, item.SubclassId, item.InventoryType))
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        var indexClassMask = items
            .CountBy(item => item.GetCalculatedClassMask())
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        var indexRaceMask = items
            .CountBy(item => item.RaceMask)
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        _timer.AddPoint("Preprocess");

        var db = ToolContext.Redis.GetDatabase();

        var cacheData = new RedisItems
        {
            CompletesQuest = completesQuestMap,
            ItemBonusListGroups = listGroups,
            RawItemBonuses = _itemBonusMap.Values
                .Where(itemBonus => itemBonus.Bonuses.Count > 0)
                .ToArray(),

            ClassIdSubclassIdInventoryTypes = indexClassIdSubclassIdInventoryType
                .OrderBy(kvp => kvp.Value)
                .Select(kvp => new short[] { kvp.Key.Item1, kvp.Key.Item2, (short)kvp.Key.Item3 })
                .ToArray(),
            ClassMasks = indexClassMask
                .OrderBy(kvp => kvp.Value)
                .Select(kvp => kvp.Key)
                .ToArray(),
            RaceMasks = indexRaceMask
                .OrderBy(kvp => kvp.Value)
                .Select(kvp => kvp.Key)
                .ToArray(),
        };
        string? cacheHash = null;

        var seen = new HashSet<(int, int)>();
        var oppositeIds = items
            .Where(item => item.OppositeFactionId > 0)
            .ToDictionary(item => item.Id, item => item.OppositeFactionId);

        cacheData.OppositeFactionIds = new(oppositeIds.Count);
        foreach ((int id1, int id2) in oppositeIds.OrderBy(kvp => kvp.Key))
        {
            int[] sorted = new[] { id1, id2 }.Order().ToArray();
            var key = (sorted[0], sorted[1]);
            if (!seen.Contains(key))
            {
                cacheData.OppositeFactionIds.Add(id1);
                cacheData.OppositeFactionIds.Add(id2);
                seen.Add(key);
            }
        }

        cacheData.RawItems = new RedisItemData[items.Length];
        int lastId = 0;
        for (int i = 0; i < items.Length; i++)
        {
            var item = items[i];
            cacheData.RawItems[i] = new RedisItemData(item)
            {
                // Id is actually the difference between this id and the previous id, saving ~5 bytes per item
                IdDiff = item.Id - lastId,
                ClassIdSubclassIdInventoryTypeIndex = indexClassIdSubclassIdInventoryType[(item.ClassId, item.SubclassId, item.InventoryType)],
                ClassMaskIndex = indexClassMask[item.GetCalculatedClassMask()],
                RaceMaskIndex = indexRaceMask[item.RaceMask],
                Appearances = itemToModifiedAppearances.GetValueOrDefault(item.Id, Array.Empty<WowItemModifiedAppearance>()),
            };
            lastId = item.Id;
        }

        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {Lang}...", language);

            foreach (var redisItem in cacheData.RawItems)
            {
                redisItem.Name = _strings.GetValueOrDefault((language, redisItem.Id), $"Item #{redisItem.Id}");
            }

            _names = cacheData.RawItems
                .CountBy(item => item.Name)
                .OrderByDescending(kvp => kvp.Value)
                .Select((kvp, index) => (kvp.Key, index))
                .ToDictionary(tup => tup.Key, tup => tup.index);

            foreach (var redisItem in cacheData.RawItems)
            {
                redisItem.NameIndex = _names[redisItem.Name];
            }

            cacheData.Names = _names
                .OrderBy(kvp => kvp.Value)
                .Select(kvp => kvp.Key)
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

    private Dictionary<string, int> _names = new();
    private int _nextName = 0;

    private int GetName(Language language, int id)
    {
        string name = _strings.GetValueOrDefault((language, id), $"Item #{id}");
        if (!_names.TryGetValue(name, out int nameIndex))
        {
            _names[name] = nameIndex = _nextName++;
        }

        return nameIndex;
    }
}
