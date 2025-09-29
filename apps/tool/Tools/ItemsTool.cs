using System.Collections.Immutable;
using Bebop.Runtime;
using Serilog.Context;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.Professions;

namespace Wowthing.Tool.Tools;

public class ItemsTool
{
    private readonly JankTimer _timer = new();

    private Dictionary<int, WowItemBonus> _itemBonusMap;
    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<(Language Language, int Id), string> _strings;

    private static readonly HashSet<short> SkipCraftingCategories =
    [
        1, // Specify Haste
        5, // Specify Mastery
        6, // Specify Critical Strike
        7, // Specify Versatility
        15, // Specify Suit
        135, // Specify Critical Strike and Haste
        388, // Specify Versatility and Mastery
        389, // Specify Mastery and Haste
        390, // Specify Versatility and Haste
        391, // Specify Crit and Mastery
        392, // Specify Versatility and Crit
        429, // Specify Ingenuity
        435, // Razor-Sharp Gear
        436, // Rapidly Ticking Gear
        437, // Meticulously-Tuned Gear
        438, // One-Size-Fits-All Gear,
        450, // Specify Resourcefulness
        451, // Specify Multicraft
        452, // Specify Crafting Speed
        453, // Specify Finesse
        454, // Specify Perception
        455, // Specify Deftness
        517, // 11.0 Professions - Modifying Reagent - Shared - Pacing - Season 1 Spark
        591, // 11.0 Optional Reagent - Season 1 - Enchanted Crests
        660, // Algari Missive of the Aurora
        661, // Algari Missive of the Feverflare
        662, // Algari Missive of the Fireflash
        663, // Algari Missive of the Harmonious
        664, // Algari Missive of the Peerless
        665, // Algari Missive of the Quickblade
        670, // Algari Missive of Ingenuity
        671, // Algari Missive of Resourcefulness
        672, // Algari Missive of Multicraft
        673, // Algari Missive of Crafting Speed
        674, // Algari Missive of Finesse
        675, // Algari Missive of Perception
        676, // Algari Missive of Deftness
        734, // 11.1 Professions - Modifying Reagent - Shared - Pacing - Season 2 Spark
        735, // 11.1 Optional Reagent - Season 2 - Enchanted Crests
        736, // 11.2 Professions - Modifying Reagent - Shared - Pacing - Season 3 Spark
        737, // 11.2 Optional Reagent - Season 3 - Enchanted Crests
        761, // 11.1.5 Optional Reagent - Season 2 - Augmentation Matrix - Mythic
        764, // 11.1.5 Optional Reagent - Season 2 - Augmentation Matrix - Heroic
    ];

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
        192552, // Fireflash
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
        206961, // Enchanted Aspect's Dreaming Crest
        212536, // Lesser Verdant Trophy of Conquest
        212538, // Greater Verdant Trophy of Conquest
        212539, // Lesser Verdant Crest of Honor
        212541, // Greater Verdant Crest of Honor

        // Dragonflight S4
        211516, // spark
        211518, // wyrm crest
        211519, // aspect crest
        211520, // whelpling crest
        211684, // Lesser Draconic Trophy of Conquest
        211685, // Draconic Trophy of Conquest
        211686, // Greater Draconic Trophy of Conquest
        211687, // Lesser Draconic Crest of Honor
        211688, // Draconic Crest of Honor
        211689, // Greater Draconic Crest of Honor
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

        var completesQuestMap = new Dictionary<int, int[]>(); // itemId -> [questIds]
        var teachesSpellMap = new Dictionary<int, int[]>(); // itemId -> [spellIds]
        var teachesTransmogIllusionMap = new Dictionary<int, int[]>(); // itemId -> [transmogIllusionIds]
        var teachesTransmogSetMap = new Dictionary<int, int>(); // itemId -> [transmogSetIds]
        foreach (var item in _itemMap.Values)
        {
            if (item.CompletesQuestIds.Length > 0)
            {
                completesQuestMap[item.Id] = item.CompletesQuestIds;
            }

            if (item.TeachesSpellIds.Length > 0)
            {
                teachesSpellMap[item.Id] = item.TeachesSpellIds;
            }

            if (item.TeachesTransmogIllusionIds.Length > 0)
            {
                teachesTransmogIllusionMap[item.Id] = item.TeachesTransmogIllusionIds;
            }

            if (item.TeachesTransmogSetIds.Length > 0)
            {
                if (item.TeachesTransmogSetIds.Length > 1)
                {
                    ToolContext.Logger.Warning("Item teaches more than one transmog set?? {itemId}", item.Id);
                }
                teachesTransmogSetMap[item.Id] = item.TeachesTransmogSetIds[0];
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

        var appearanceMap = await LoadItemDisplayInfos();

        var cacheData = new RedisItems
        {
            AppearanceMap = appearanceMap,
            CompletesQuest = completesQuestMap,
            CraftingQualities = idsByCraftingQuality,
            ItemBonusListGroups = listGroups,
            ItemConversionEntries = await LoadItemConversionEntries(),
            LimitCategories = await LoadLimitCategories(),
            SpecOverrides = await LoadSpecOverrides(),
            TeachesIllusion = teachesTransmogIllusionMap,
            TeachesSpell = teachesSpellMap,
            TeachesTransmog = teachesTransmogSetMap,

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

            LimitCategoryItems = _itemMap.Values.Where(item => item.LimitCategory > 0)
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
        var bebopItems = new BebopItem[_itemMap.Count];
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
                    itemToModifiedAppearances.GetValueOrDefault(item.Id, []),
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

            // if (language == Language.enUS)
            // {
            //     var wordCounts = new Dictionary<string, int>();
            //     foreach (string name in _names.Keys)
            //     {
            //         foreach (string part in name.Split(' ').Where(word => word.Length > 3))
            //         {
            //             wordCounts[part] = wordCounts.GetValueOrDefault(part, 0) + 1;
            //         }
            //     }
            //
            //     int total = 0;
            //     foreach ((string word, int count) in wordCounts.OrderByDescending(kvp => (kvp.Key.Length - 1) * kvp.Value).Take(63))
            //     {
            //         int saved = (word.Length - 1) * count;
            //         total += saved;
            //         Console.WriteLine("{0}x {1} => {2} bytes", count, word, saved);
            //     }
            //     Console.WriteLine("-- TOTAL = {0} bytes", total);
            //
            //     break;
            // }

            string cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"item-{language.ToString()}", cacheJson, cacheHash);


            var bebopBuffer = new byte[1000];
            using var bebopStream = new MemoryStream();
            foreach (var item in items)
            {
                // s6_c6_i20
                uint idClassIdSubclassId = (uint)item.Id | ((uint)item.ClassId << 20) | ((uint)item.SubclassId << 26);
                // e4_b4
                byte bindTypeExpansion = (byte)((int)item.BindType | (item.Expansion << 4));
                // q4_p4
                byte primaryStatQuality = (byte)((int)item.PrimaryStat | ((int)item.Quality << 4));

                // s4_m8_a20
                var appearances = itemToModifiedAppearances.GetValueOrDefault(item.Id, [])
                    .Select(app => (uint)app.AppearanceId | ((uint)app.Modifier << 20) | ((uint)app.SourceType << 28))
                    .ToArray();

                var bebopItem = new BebopItem
                {
                    IdClassIdSubclassId = idClassIdSubclassId,
                    BindTypeExpansion = bindTypeExpansion,
                    PrimaryStatQuality = primaryStatQuality,
                    RaceMask = item.RaceMask,
                    ClassMask = item.ClassMask,
                    Flags = (byte)item.Flags,
                    InventoryType = (byte)item.InventoryType,
                    ItemLevel = item.ItemLevel,
                    Unique = item.Unique,
                    Name = _strings.GetValueOrDefault((language, item.Id), $"Item #{item.Id}"),
                    Sockets = [..item.Sockets.Select(socket => (byte)socket)],
                    Appearances = appearances
                };
                int bytesWritten = BebopSerializer.EncodeIntoBuffer(bebopItem, bebopBuffer);
                bebopStream.Write(bebopBuffer, 0, bytesWritten);
            }

            ToolContext.Logger.Warning("Bebop stream is {n} bytes", bebopStream.Length);
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

    private async Task<Dictionary<short, short>> LoadLimitCategories()
    {
        var limitCategories = await DataUtilities.LoadDumpCsvAsync<DumpItemLimitCategory>(
            "itemlimitcategory");
        return limitCategories.ToDictionary(
            lc => lc.ID,
            lc => lc.Quantity
        );
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

            if (SkipCraftingCategories.Contains(mcReagentItem.ModifiedCraftingCategoryID))
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
                if (ret.TryGetValue(treeNode.ChildItemBonusListID, out var impostor))
                {
                    ToolContext.Logger.Warning("Duplicate bonus list {id} - item={item1} name={name1} / item={item2} name={name2}",
                        treeNode.ChildItemBonusListID, impostor.ItemId, impostor.DisplayName, mcItem.ItemID, mcCategory.DisplayName);
                    continue;
                }

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

    private async Task<Dictionary<int, int>> LoadItemDisplayInfos()
    {
        var allItemAppearance = await DataUtilities.LoadDumpCsvAsync<DumpItemAppearance>("itemappearance");
        var allItemDisplayInfoMaterialRes = await DataUtilities.LoadDumpCsvAsync<DumpItemDisplayInfoMaterialRes>("itemdisplayinfomaterialres");

        // generate a mapping of appearance components -> DisplayInfoIDs
        var displayInfoToRes = allItemDisplayInfoMaterialRes
            .GroupBy(res => res.ItemDisplayInfoID)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(res => res.ComponentSection).ToArray()
            );

        var modelsToDisplayInfoIds = new Dictionary<string, List<int>>();
        foreach (var (displayInfoId, parts) in displayInfoToRes)
        {
            string components = string.Join(
                "|",
                parts.Select(part => $"{part.ComponentSection}-{part.MaterialResourcesID}")
            );

            if (!modelsToDisplayInfoIds.TryGetValue(components, out var displayInfos))
            {
                displayInfos = modelsToDisplayInfoIds[components] = [];
            }
            displayInfos.Add(displayInfoId);
        }

        var displayInfoIdToAppearanceIds = allItemAppearance
            .Where(ia => ia.ItemDisplayInfoID > 0)
            .GroupBy(ia => ia.ItemDisplayInfoID)
            .ToDictionary(
                group => group.Key,
                group => group.Select(ia => ia.ID).ToArray());

        var appearanceMap = new Dictionary<int, int>();
        foreach (var displayInfoIds in modelsToDisplayInfoIds.Values)
        {
            if (!displayInfoIdToAppearanceIds.TryGetValue(displayInfoIds[0], out var firstAppearanceIds))
            {
                continue;
            }

            foreach (int appearanceId in firstAppearanceIds.Skip(1))
            {
                appearanceMap[appearanceId] = firstAppearanceIds[0];
            }

            foreach (int displayInfoId in displayInfoIds.Skip(1))
            {
                if (!displayInfoIdToAppearanceIds.TryGetValue(displayInfoId, out var appearanceIds))
                {
                    continue;
                }

                foreach (int appearanceId in appearanceIds)
                {
                    appearanceMap[appearanceId] = firstAppearanceIds[0];
                }
            }
        }

        foreach (var (appearanceId1, appearanceId2) in appearanceMap)
        {
            Console.WriteLine($"{appearanceId1} -> {appearanceId2}");
        }

        return appearanceMap;
    }

    private async Task<RedisItemSet[]> LoadItemSets(Language language)
    {
        return (await DataUtilities.LoadDumpCsvAsync<DumpItemSet>("itemset", language))
            .Where(set => set.ItemIDs.Length > 0)
            .Select(set => new RedisItemSet(set))
            .ToArray();
    }

    private static HashSet<int> GarbageSpecializationIds =
    [
        1444, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1465,
    ];

    private async Task<Dictionary<int, int[]>> LoadSpecOverrides()
    {
        var itemSpecOverrides = await DataUtilities.LoadDumpCsvAsync<DumpItemSpecOverride>("itemspecoverride");
        var grouped = itemSpecOverrides.ToGroupedDictionary(
            iso => iso.ItemID,
            iso => iso.SpecID
        );

        foreach ((int itemId, int[] specIds) in Hardcoded.ItemSpecOverrides)
        {
            grouped[itemId] = specIds;
        }

        return grouped
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Where(id => !GarbageSpecializationIds.Contains(id)).Order().ToArray()
            );
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
