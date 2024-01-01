using MoreLinq;
using Serilog.Context;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.Professions;

namespace Wowthing.Tool.Tools;

public class ItemsTool
{
    private readonly JankTimer _timer = new();

    private Dictionary<int, WowItemBonus> _itemBonusMap;
    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<(Language Language, int Id), string> _strings;

    private static readonly HashSet<int> SkipReagentItems = [
        202208,
        202209,
        202210,
        202211,
        202212,
        202213,
        202214,
        202215,
        202216,
        202217,
        202218,
        202219,

        // Dragonflight Missives
        194552, // Fireflash
        194566, // Feverflare
        194569, // Aurora
        194572, // Quickblade
        194575, // Harmonious
        194578, // Peerless

        // Dragonflight S1
        204186, // Greater Obsidian Trophy of Conquest
        204188, // Lesser Obsidian Trophy of Conquest
        204189, // Greater Obsidian Crest of Honor
        204191, // Lesser Obsidian Crest of Honor

        // Dragonflight S2?
        208564, // Lesser Trophy of Conquest
        208565,
        208566, // Greater Trophy of Conquest
        208568, // Lesser Crest of Honor
        208569,
        208570, // Greater Crest of Honor

        // Dragonflight S3
        206959, // Spark of Dreams
        206960, // Enchanted Wyrm's Dreaming Crest
        206961, // ENchanted Aspect's Dreaming Crest
        212536, // Lesser Verdant Trophy of Conquest
        212538, // Greater Verdant Trophy of Conquest
        212539, // Lesser Verdant Crest of Honor
        212541, // Greater Verdant Crest of Honor
    ];

    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Items");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading data...");

        _itemMap = await context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

        _itemBonusMap = await context.WowItemBonus
            .ToDictionaryAsync(wib => wib.Id);

        var itemEffects = await context.WowItemEffectV2.ToArrayAsync();

        var completesQuestMap = new Dictionary<int, List<int>>();
        var teachesSpellMap = new Dictionary<int, int>();
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
                    else if (spellEffect.Effect == WowSpellEffectEffect.LearnSpell && spellEffect.Values[0] > 0)
                    {
                        if (teachesSpellMap.ContainsKey(itemEffect.ItemId))
                        {
                            ToolContext.Logger.Warning("Item teaches multiple spells?? {itemId}", itemEffect.ItemId);
                            continue;
                        }

                        teachesSpellMap[itemEffect.ItemId] = spellEffect.Values[0];
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

        var indexClassIdSubclassIdInventoryType = _itemMap.Values
            .CountBy(item => (item.ClassId, item.SubclassId, item.InventoryType))
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        var indexClassMask = _itemMap.Values
            .CountBy(item => item.GetCalculatedClassMask())
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        var indexRaceMask = _itemMap.Values
            .CountBy(item => item.RaceMask)
            .OrderByDescending(kvp => kvp.Value)
            .Select((kvp, index) => (kvp.Key, index))
            .ToDictionary(tup => tup.Key, tup => tup.index);

        var idsByCraftingQuality = _itemMap.Values
            .Where(item => item.CraftingQuality > 0)
            .GroupBy(item => item.CraftingQuality)
            .ToDictionary(
                group => group.Key,
                group => group.Select(item => item.Id).Order().ToArray()
            );

        _timer.AddPoint("Preprocess");

        var db = ToolContext.Redis.GetDatabase();

        var cacheData = new RedisItems
        {
            CompletesQuest = completesQuestMap,
            CraftingQualities = idsByCraftingQuality,
            ItemBonusListGroups = listGroups,
            ItemConversionEntries = await LoadItemConversionEntries(),
            TeachesSpell = teachesSpellMap,

            RawItemBonuses = _itemBonusMap.Values
                .Where(itemBonus => itemBonus.Bonuses.Count > 0)
                .OrderBy(itemBonus => itemBonus.Id)
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

            LimitCategories = _itemMap.Values.Where(item => item.LimitCategory > 0)
                .GroupBy(item => item.LimitCategory)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(item => item.Id).ToArray()
                ),
        };
        string? cacheHash = null;

        var seen = new HashSet<(int, int)>();
        var oppositeIds = _itemMap.Values
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

        var items = _itemMap.Values.OrderBy(item => item.Id).ToArray();
        cacheData.RawItems = new RedisItemData[_itemMap.Count];
        int lastId = 0;
        for (int i = 0; i < items.Length; i++)
        {
            var item = items[i];
            cacheData.RawItems[i] = new RedisItemData(item)
            {
                // Id is actually the difference between this id and the previous id, saving ~5 bytes per item
                IdDiff = item.Id - lastId,
                ClassIdSubclassIdInventoryTypeIndex =
                    indexClassIdSubclassIdInventoryType[(item.ClassId, item.SubclassId, item.InventoryType)],
                ClassMaskIndex = indexClassMask[item.GetCalculatedClassMask()],
                RaceMaskIndex = indexRaceMask[item.RaceMask],
                Appearances =
                    itemToModifiedAppearances.GetValueOrDefault(item.Id, Array.Empty<WowItemModifiedAppearance>()),
            };
            lastId = item.Id;
        }

        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {Lang}...", language);

            cacheData.BonusIdToModifiedCrafting = await LoadModifiedCrafting(context);

            cacheData.RawItemSets = await LoadItemSets(language);

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
                bool foundGroup = false;
                bool foundItemNameDescription = false;

                foreach (var bonusData in _itemBonusMap[itemBonusId].Bonuses)
                {
                    // Bonus type 34, ItemBonusListGroupID, SharedStringID?
                    if (bonusData[0] == 34)
                    {
                        int sharedStringId = bonusData.Count >= 3 ? bonusData[2] : 0;
                        if (!groupedBySharedString[bonusGroupId].TryGetValue(sharedStringId, out var oof))
                        {
                            oof = groupedBySharedString[bonusGroupId][sharedStringId] = new();
                        }

                        oof.Add(itemBonusId);
                        foundGroup = true;
                        break;
                    }
                    // ItemNameDescription => Dragonflight Season 2
                    else if (bonusData[0] == 4 && bonusData[1] == 14043)
                    {
                        foundItemNameDescription = true;
                    }
                }

                if (!foundGroup && foundItemNameDescription)
                {
                    groupedBySharedString[bonusGroupId].TryAdd(0, new());
                    groupedBySharedString[bonusGroupId][0].Add(itemBonusId);
                }
            }
        }

        return groupedBySharedString;
    }

    private async Task<Dictionary<int, RedisReagentBonus>> LoadModifiedCrafting(WowDbContext context)
    {
        var mcItems = await DataUtilities.LoadDumpCsvAsync<DumpModifiedCraftingItem>(
            "modifiedcraftingitem");

        var mcCategoryMap =
            await DataUtilities.LoadDumpToDictionaryAsync<int, DumpModifiedCraftingCategory>(
            "modifiedcraftingcategory", mcc => mcc.ID);

        var mcReagentItemMap =
            await DataUtilities.LoadDumpToDictionaryAsync<int, DumpModifiedCraftingReagentItem>(
                "modifiedcraftingreagentitem", mcri => mcri.ID);

        var ibTreeNodes = (await DataUtilities.LoadDumpCsvAsync<DumpItemBonusTreeNode>("itembonustreenode"))
            .ToGroupedDictionary(node => node.ParentItemBonusTreeID);

        var ret = new Dictionary<int, RedisReagentBonus>();
        foreach (var mcItem in mcItems.Where(mcItem => mcItem.ModifiedCraftingReagentItemID > 0))
        {
            if (SkipReagentItems.Contains(mcItem.ItemID))
            {
                continue;
            }

            if (!_itemMap.TryGetValue(mcItem.ItemID, out var item))
            {
                ToolContext.Logger.Warning("Invalid ItemID on ModifiedCraftingItem {id}", mcItem.ItemID);
                continue;
            }

            if (item.CraftingQuality is > 0 and < 3)
            {
                // ToolContext.Logger.Warning("- Skipping due to item crafting quality {q}", item.CraftingQuality);
                continue;
            }

            if (!mcReagentItemMap.TryGetValue(mcItem.ModifiedCraftingReagentItemID, out var mcReagentItem))
            {
                ToolContext.Logger.Warning("Invalid ModifiedCraftingReagentItemID on ModifiedCraftingItem {id}", mcItem.ItemID);
                continue;
            }

            if (mcReagentItem.ItemBonusTreeID == 0)
            {
                continue;
            }

            if (!ibTreeNodes.TryGetValue(mcReagentItem.ItemBonusTreeID, out var treeNodes))
            {
                ToolContext.Logger.Warning("No ItemBonusTreeNodes on ModifiedCraftingReagentItem {id}", mcReagentItem.ID);
                continue;
            }

            if (!mcCategoryMap.TryGetValue(mcReagentItem.ModifiedCraftingCategoryID, out var mcCategory))
            {
                ToolContext.Logger.Warning("Invalid ModifiedCraftingCategoryID on ModifiedCraftingReagentItem {id}", mcReagentItem.ID);
                continue;
            }

            ToolContext.Logger.Information("ItemID={0} BonusTreeID={1} Name={2}",
                mcItem.ItemID, mcReagentItem.ItemBonusTreeID, mcCategory.DisplayName);

            foreach (var treeNode in treeNodes)
            {
                // Sets the ItemLimitCategory
                if (treeNode.ChildItemBonusListID == 8960)
                {
                    continue;
                }

                // var redisBonus = new RedisReagentBonus
                // {
                //
                // };
                ToolContext.Logger.Information("  - Node {id}", treeNode.ChildItemBonusListID);
                ret.Add(treeNode.ChildItemBonusListID, new RedisReagentBonus
                {
                    ItemId = mcItem.ItemID,
                    DisplayName = mcCategory.DisplayName,
                });
            }
        }

        return ret;
    }

    private async Task<Dictionary<short, int[]>> LoadItemConversionEntries()
    {
        return (await DataUtilities.LoadDumpCsvAsync<DumpItemConversionEntry>("itemconversionentry"))
            .GroupBy(ice => ice.ItemConversionID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(ice => ice.ItemID)
                    .Order()
                    .ToArray()
            );
    }

    private async Task<RedisItemSet[]> LoadItemSets(Language language)
    {
        return (await DataUtilities.LoadDumpCsvAsync<DumpItemSet>("itemset", language))
            .Where(set => set.ItemIDs.Length > 0)
            .Select(set => new RedisItemSet(set))
            .ToArray();
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
