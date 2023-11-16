using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Collections;
using Wowthing.Tool.Models.Dragonriding;
using Wowthing.Tool.Models.Heirlooms;
using Wowthing.Tool.Models.Illusions;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.ItemSets;
using Wowthing.Tool.Models.Manual;
using Wowthing.Tool.Models.Progress;
using Wowthing.Tool.Models.Transmog;
using Wowthing.Tool.Models.Vendors;
using Wowthing.Tool.Models.ZoneMaps;

namespace Wowthing.Tool.Tools;

public class ManualTool
{
    private readonly JankTimer _timer = new();

    private IDatabase _db;

    private Dictionary<int, int> _bonusAppearanceModifiers;
    private Dictionary<int, int[]> _collectionItemToModifiedAppearances;
    private Dictionary<int, Dictionary<short, int>> _itemToAppearance;
    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<int, WowItemModifiedAppearance> _itemModifiedAppearanceMap;
    private Dictionary<int, WowMount> _mountMap;
    private Dictionary<int, WowPet> _petMap;
    private Dictionary<int, WowToy> _toyMap;
    private Dictionary<(StringType Type, int Id), string> _stringMap;

    private int _tagIndex = 1;
    private HashSet<int> _questIds = new();
    private readonly Dictionary<string, int> _tagMap = new();

    private static readonly StringType[] StringTypes =
    {
        StringType.WowCreatureName,
        StringType.WowItemName,
        StringType.WowMountName,
    };

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Manual");
        await using var  context = ToolContext.GetDbContext();

        _db = ToolContext.Redis.GetDatabase();

        ToolContext.Logger.Information("Loading data...");

        await LoadBasicData(context);

        await CacheData(context);

        ToolContext.Logger.Information("{Timer}", _timer.ToString());
    }

    private string GetString(StringType type, int id)
    {
        if (!_stringMap.TryGetValue((type, id), out var languageName))
        {
            languageName = _stringMap.GetValueOrDefault(
                (type, id), $"{type.ToString()} #{id}");
        }

        return languageName;
    }

    private async Task LoadBasicData(WowDbContext context)
    {
        _stringMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == Language.enUS && StringTypes.Contains(ls.Type))
            .ToDictionaryAsync(
                ls => (ls.Type, ls.Id),
                ls => ls.String
            );
        _timer.AddPoint("Strings");

        _itemMap = await  context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

        var itemModifiedAppearances = await  context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        _itemModifiedAppearanceMap = itemModifiedAppearances
            .ToDictionary(ima => ima.Id);

        _itemToAppearance = itemModifiedAppearances
            .GroupBy(ima => ima.ItemId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .GroupBy(ima => ima.Modifier)
                    .ToDictionary(
                        modifierGroup => modifierGroup.Key,
                        modifierGroup => modifierGroup
                            .OrderByDescending(ima => ima.Id)
                            .First()
                            .AppearanceId
                    )
            );

        _mountMap = await context.WowMount
            .AsNoTracking()
            .ToDictionaryAsync(mount => mount.Id);

        _petMap = await context.WowPet
            .AsNoTracking()
            .Where(pet => (pet.Flags & 32) == 0)
            .ToDictionaryAsync(pet => pet.Id);

        _toyMap = await context.WowToy
            .AsNoTracking()
            .ToDictionaryAsync(toy => toy.ItemId);

        var transmogSets = (await DataUtilities.LoadDumpCsvAsync<DumpTransmogSetItem>("transmogsetitem"))
            .ToGroupedDictionary(tsi => tsi.TransmogSetID);

        var itemEffects = await context.WowItemEffectV2
            .ToArrayAsync();

        var transmogSetEffects = itemEffects.Where(itemEffect =>
            itemEffect.SpellEffects.Any(kvp =>
                kvp.Value.Any(kvp2 =>
                    kvp2.Value.Effect == WowSpellEffectEffect.LearnTransmogSet
                )
            )
        ).ToArray();

        _collectionItemToModifiedAppearances = transmogSetEffects
            .GroupBy(wie => wie.ItemId)
            .ToDictionary(
                group => group.Key,
                group => transmogSets.GetValueOrDefault(
                        group
                            .First()
                            .SpellEffects
                            .SelectMany(se =>
                                se.Value.Where(se2 =>
                                    se2.Value.Effect == WowSpellEffectEffect.LearnTransmogSet
                                ).Select(se2 => se2.Value)
                            )
                            .First()
                            .Values[0],
                        Array.Empty<DumpTransmogSetItem>()
                    )
                    .Select(tsi => tsi.ItemModifiedAppearanceID)
                    .Where(id => _itemModifiedAppearanceMap[id].SourceType != 9) // NotValidForTransmog
                    .ToArray()
            );

        _bonusAppearanceModifiers = (await DataUtilities.LoadDumpCsvAsync<DumpItemBonus>("itembonus"))
            .Where(ib => ib.Type == 7) // TODO fix hardcoded
            .GroupBy(ib => ib.ParentItemBonusListID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(ib => ib.OrderIndex)
                    .First()
                    .Value0
            );

        _timer.AddPoint("Load");
    }

    private async Task CacheData(WowDbContext context)
    {
        var cacheData = new ManualCache();

        // Mount sets
        var mountSets = LoadCollectionSets("mounts");
        AddUncategorized("mounts", _mountMap, mountSets,
            id => GetString(StringType.WowMountName, id));
        cacheData.RawMountSets = FinalizeCollections(mountSets);
        _timer.AddPoint("Mounts");

        // Pet sets
        var petSets = LoadCollectionSets("pets");
        AddUncategorized("pets", _petMap, petSets,
            id => GetString(StringType.WowCreatureName, _petMap[id].CreatureId));
        cacheData.RawPetSets = FinalizeCollections(petSets);
        _timer.AddPoint("Pets");

        // Toy sets
        var toySets = LoadCollectionSets("toys");
        AddUncategorized("toys", _toyMap, toySets,
            id => GetString(StringType.WowItemName, id));
        cacheData.RawToySets = FinalizeCollections(toySets);
        _timer.AddPoint("Toys");

        cacheData.Dragonriding = LoadDragonriding();
        _timer.AddPoint("Dragonriding");

        cacheData.RawHeirloomGroups = LoadHeirlooms();
        _timer.AddPoint("Heirlooms");

        cacheData.RawIllusionGroups = LoadIllusions();
        _timer.AddPoint("Illusions");

        cacheData.RawSharedItemSets = LoadSharedItemSets();
        _timer.AddPoint("ItemSets");

        cacheData.ProgressSets = LoadProgress();
        _timer.AddPoint("Progress");

        cacheData.RawTransmogSets = LoadTransmog();
        _timer.AddPoint("Transmog");

        cacheData.RawSharedVendors = LoadSharedVendors();
        cacheData.RawVendorSets = LoadVendors();
        _timer.AddPoint("Vendors");

        cacheData.RawZoneMapSets = LoadZoneMaps();
        _timer.AddPoint("ZoneMaps");

        cacheData.RawTags = _tagMap
            .OrderBy(kvp => kvp.Value)
            .Select(kvp => new object[] { kvp.Value, kvp.Key })
            .ToList();

        _timer.AddPoint("Tags");

#if DEBUG
        DumpZoneMapQuests(cacheData.RawSharedVendors, cacheData.RawZoneMapSets);
#endif

        // Save the data to Redis
        ToolContext.Logger.Information("Generating...");

        string cacheJson = ToolContext.SerializeJson(cacheData);
        string cacheHash = cacheJson.Md5();
        _timer.AddPoint("JSON");

        foreach (var language in Enum.GetValues<Language>())
        {
            await _db.SetCacheDataAndHash($"manual-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Generate");

        // Save any new quest IDs
        var existingQuestIds = (await  context.WowQuest
            .Select(q => q.Id)
            .ToArrayAsync())
            .ToHashSet();

        int[] newQuestIds = _questIds.Except(existingQuestIds).ToArray();
        foreach (int questId in newQuestIds)
        {
            context.WowQuest.Add(new WowQuest(questId));
        }

        await context.SaveChangesAsync();

        _timer.AddPoint("Quests", true);
    }

    private List<DataDragonridingCategory> LoadDragonriding()
    {
        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "dragonriding"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var ret = new List<DataDragonridingCategory>();

        foreach (var file in files)
        {
            var category = DataUtilities.YamlDeserializer.Deserialize<DataDragonridingCategory>(File.OpenText(file.FullName));
            ret.Add(category);
        }

        return ret;
    }

    private DataHeirloomGroup[] LoadHeirlooms()
    {
        return DataUtilities.YamlDeserializer
            .Deserialize<DataHeirloomGroup[]>(
                File.OpenText(
                    Path.Join(DataUtilities.DataPath, "heirlooms", "heirlooms.yml")
                )
            );
    }

    private DataIllusionGroup[] LoadIllusions()
    {
        return DataUtilities.YamlDeserializer
            .Deserialize<DataIllusionGroup[]>(
                File.OpenText(
                    Path.Join(DataUtilities.DataPath, "illusions", "illusions.yml")
                )
            );
    }

    private List<List<OutProgress>> LoadProgress()
    {
        var progressSets = DataUtilities.LoadData<DataProgress>("progress", ToolContext.Logger);
        var ret = new List<List<OutProgress>>(progressSets.Count);
        foreach (var progressSet in progressSets)
        {
            if (progressSet == null)
            {
                ret.Add(null);
                continue;
            }

            ret.Add(progressSet
                .Select(category => category == null ? null : new OutProgress(category))
                .ToList()
            );
        }

        _timer.AddPoint("Progress");
        return ret;
    }

    private void AddTags(List<string> tags)
    {
        foreach (string tag in tags.EmptyIfNull())
        {
            if (!_tagMap.ContainsKey(tag))
            {
                _tagMap[tag] = _tagIndex++;
            }
        }

    }

    private List<ManualSharedItemSet> LoadSharedItemSets()
    {
        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "_shared", "item-sets"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var ret = new List<ManualSharedItemSet>();

        foreach (var file in files)
        {
            ToolContext.Logger.Debug("Parsing {file}", file.FullName);
            var itemSets = DataUtilities.YamlDeserializer.Deserialize<DataSharedItemSets>(File.OpenText(file.FullName));

            if (itemSets == null)
            {
                continue;
            }

            AddTags(itemSets.Tags);

            foreach (var itemSet in itemSets.Sets)
            {
                AddTags(itemSet.Tags.EmptyIfNull());

                var tags = itemSets.Tags
                    .Union(itemSet.Tags.EmptyIfNull())
                    .Select(tag => _tagMap[tag])
                    .OrderBy(tag => tag)
                    .ToList();

                ret.Add(new ManualSharedItemSet(itemSet, tags));
            }
        }

        return ret;
    }

    private List<ManualSharedVendor> LoadSharedVendors()
    {
        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "_shared", "vendor"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var ret = new List<ManualSharedVendor>(files.Length);

        foreach (var file in files)
        {
            ToolContext.Logger.Debug("Parsing {file}", file.FullName);
            var vendor = DataUtilities.YamlDeserializer.Deserialize<DataSharedVendor>(File.OpenText(file.FullName));
            ret.Add(new ManualSharedVendor(vendor));
        }

        foreach (var vendor in ret)
        {
            foreach (var item in vendor.Sells)
            {
                DoCommonItemStuff(item);

                if (item.Type == RewardType.Quest)
                {
                    if (item.Id > 0)
                    {
                        _questIds.Add(item.Id);
                    }
                    else
                    {
                        ToolContext.Logger.Warning("Missing quest ID on vendor {name} sells", vendor.Name);
                    }
                }
            }
        }

        return ret
            .OrderBy(vendor => vendor.Id)
            .ToList();
    }

    // Generate and cache output
    private List<List<ManualTransmogCategory>> LoadTransmog()
    {
        var transmogSets = DataUtilities.LoadData<DataTransmogCategory>("transmog", ToolContext.Logger);

        var ret = new List<List<ManualTransmogCategory>>(transmogSets.Count);

        foreach (var catList in transmogSets)
        {
            if (catList == null)
            {
                ret.Add(null);
            }
            else
            {
                ret.Add(catList
                    .Select(cat => cat == null ? null : new ManualTransmogCategory(cat))
                    .ToList()
                );
            }
        }

        return ret;
    }

    private List<List<ManualVendorCategory>> LoadVendors()
    {
        var vendorSets = DataUtilities.LoadData<DataVendorCategory>("vendors", ToolContext.Logger);

        var ret = new List<List<ManualVendorCategory>>(vendorSets.Count);
        foreach (var catList in vendorSets)
        {
            if (catList == null)
            {
                ret.Add(null);
            }
            else
            {
                ret.Add(catList
                    .Select(cat => cat == null ? null : new ManualVendorCategory(cat))
                    .ToList()
                );
            }
        }

        foreach (var categories in ret.Where(cats => cats != null))
        {
            foreach (var category in categories.Where(cat => cat != null))
            {
                foreach (var group in category.Groups)
                {
                    foreach (var item in group.Things)
                    {
                        DoCommonItemStuff(item);
                    }
                }
            }
        }

        return ret;
    }

    private void DoCommonItemStuff(ManualVendorItem item)
    {
        if (item.Type is RewardType.Item or RewardType.Transmog)
        {
            if ((item.AppearanceIds?.Length ?? 0) == 0 && item.BonusIds?.Length > 0)
            {
                foreach (int bonusId in item.BonusIds)
                {
                    if (_itemToAppearance.TryGetValue(item.Id, out var appearances) &&
                        _bonusAppearanceModifiers.TryGetValue(bonusId, out int modifierId) &&
                        appearances.TryGetValue((short)modifierId, out var appearanceId))
                    {
                        item.AppearanceIds = new[] { appearanceId };
                        break;
                    }
                }
            }

            var dropItem = _itemMap[item.Id];
            if (_collectionItemToModifiedAppearances.TryGetValue(item.Id, out var imas))
            {
                item.AppearanceIds = imas
                    .Select(ima => _itemModifiedAppearanceMap[ima].AppearanceId)
                    .Distinct()
                    .OrderBy(id => id)
                    .ToArray();
            }

            if (dropItem.ClassId == 2)
            {
                item.Type = RewardType.Weapon;
                item.SubType = dropItem.SubclassId;
            }
            else if (dropItem.ClassId == 4)
            {
                if (dropItem.SubclassId == 6 ||
                    dropItem.InventoryType == WowInventoryType.HeldInOffHand)
                {
                    item.Type = RewardType.Weapon;
                    item.SubType = dropItem.InventoryType == WowInventoryType.HeldInOffHand
                        ? 30
                        : 31;
                }
                else if (
                    dropItem.SubclassId is (short)WowArmorSubclass.Cosmetic or (short)WowArmorSubclass.Tabard ||
                    (dropItem.SubclassId is not (>= 1 and <= 4) && dropItem.Flags.HasFlag(WowItemFlags.Cosmetic))
                )
                {
                    item.Type = RewardType.Cosmetic;
                }
                else
                {
                    item.Type = RewardType.Armor;
                    item.SubType = dropItem.InventoryType == WowInventoryType.Back
                        ? 0
                        : dropItem.SubclassId;
                }
            }
        }

        if (item.Type == RewardType.Mount)
        {
            item.Quality = WowQuality.Epic;
        }
        else if (item.Type == RewardType.Pet)
        {
            item.Quality = WowQuality.Rare;
        }
        else
        {
            item.ClassMask = _itemMap[item.Id].GetCalculatedClassMask();
            if (item.Quality == WowQuality.Poor)
            {
                item.Quality = _itemMap[item.Id].Quality;
            }
        }
    }

    private List<List<ManualZoneMapCategory>> LoadZoneMaps()
    {
        var zoneMapSets = DataUtilities.LoadData<DataZoneMapCategory>("zone-maps", ToolContext.Logger);

        var ret = new List<List<ManualZoneMapCategory>>(zoneMapSets.Count);

        foreach (var catList in zoneMapSets)
        {
            if (catList == null)
            {
                ret.Add(null);
            }
            else
            {
                ret.Add(catList.Select(cat => cat == null ? null : new ManualZoneMapCategory(cat))
                    .ToList());
            }
        }

        foreach (var categories in ret.Where(cats => cats != null))
        {
            foreach (var category in categories.Where(cat => cat != null))
            {
                foreach (var farm in category.Farms)
                {
                    // This doesn't work as we don't have a mapping of NPC ID -> Creature ID
                    /*if (farm.IdType == FarmIdType.Npc && farm.Id > 0)
                    {
                        farm.Name = _stringMap.GetValueOrDefault((StringType.WowCreatureName, language, farm.Id), farm.Name);
                    }*/

                    if (farm.Type == FarmType.Quest)
                    {
                        if (farm.Id > 0)
                        {
                            _questIds.Add(farm.Id);
                        }
                        else
                        {
                            ToolContext.Logger.Warning("Missing quest ID on farm '{name}'", farm.Name);
                        }
                    }

                    foreach (var drop in farm.Drops)
                    {
                        switch (drop.Type)
                        {
                            case "mount":
                            case "pet":
                            case "toy":
                            case "item":
                                break;

                            case "quest":
                                if (drop.Id > 0)
                                {
                                    _questIds.Add(drop.Id);
                                }
                                else
                                {
                                    ToolContext.Logger.Warning("Missing quest ID on farm '{name}' drop", farm.Name);
                                }

                                break;

                            case "transmog":
                            {
                                var dropItem = _itemMap[drop.Id];
                                if (dropItem.ClassId == 2)
                                {
                                    drop.Type = "weapon";
                                    drop.SubType = dropItem.SubclassId;
                                }
                                else if (dropItem.ClassId == 4)
                                {
                                    if (dropItem.SubclassId == 6 ||
                                        dropItem.InventoryType == WowInventoryType.HeldInOffHand)
                                    {
                                        drop.Type = "weapon";
                                        drop.SubType = dropItem.InventoryType == WowInventoryType.HeldInOffHand
                                            ? 30
                                            : 31;
                                    }
                                    else if (dropItem.SubclassId == 5 || dropItem.Flags.HasFlag(WowItemFlags.Cosmetic))
                                    {
                                        drop.Type = "cosmetic";
                                    }
                                    else
                                    {
                                        drop.Type = "armor";
                                        drop.SubType = dropItem.InventoryType == WowInventoryType.Back
                                            ? 0
                                            : dropItem.SubclassId;
                                    }
                                }

                                drop.ClassMask = dropItem.GetCalculatedClassMask();
                                break;
                            }
                        }
                    }
                }
            }
        }

        return ret;
    }

    private void DumpZoneMapQuests(
        List<ManualSharedVendor> sharedVendors,
        List<List<ManualZoneMapCategory>> zoneMaps
    )
    {
        var seenQuestIds = new HashSet<int>();
        using var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "auto_zone_maps.txt"));

        foreach (var vendor in sharedVendors)
        {
            var questSells = vendor.Sells
                .EmptyIfNull()
                .Where(sell => sell.Type == RewardType.Quest)
                .ToArray();

            foreach (var sell in questSells)
            {
                seenQuestIds.Add(sell.Id);
            }
        }

        foreach (var categories in zoneMaps.Where(zm => zm != null))
        {
            foreach (var category in categories.Where(cat => cat != null))
            {
                foreach (var farm in category.Farms.Where(farm => farm.Type != FarmType.Quest))
                {
                    foreach (int questId in farm.QuestIds.Where(id => id > 0))
                    {
                        seenQuestIds.Add(questId);
                    }

                    foreach (var drop in farm.Drops)
                    {
                        var questIds = drop.QuestIds
                            .EmptyIfNull()
                            .Concat(drop.Type == "xpquest" ? new[] { drop.Id } : Array.Empty<int>())
                            .ToArray();

                        foreach (int dropQuestId in questIds)
                        {
                            seenQuestIds.Add(dropQuestId);
                        }
                    }
                }
            }
        }

        outFile.WriteLine("-- This data is overwritten by the *manual* tool, don't edit by hand");
        outFile.WriteLine("Module.db.auto.zoneMaps = {");
        foreach (int[] chunk in seenQuestIds.OrderBy(id => id).Chunk(12))
        {
            outFile.WriteLine("    {0},", string.Join(", ", chunk));
        }
        outFile.WriteLine("}");
    }

    #region Collections

    private List<List<DataCollectionCategory>> LoadCollectionSets(string dirName)
    {
        return DataUtilities.LoadData<DataCollectionCategory>(dirName, ToolContext.Logger);
    }

    private void AddUncategorized<T>(
        string dirName,
        Dictionary<int, T> lookupMap,
        List<List<DataCollectionCategory>> thingSets,
        Func<int, string> nameFunc
    )
    {
        var skip = Array.Empty<int>();
        var skipPath = Path.Join(DataUtilities.DataPath, dirName, "_skip.yml");
        if (File.Exists(skipPath))
        {
            var newSkip = DataUtilities.YamlDeserializer.Deserialize<string[]>(File.OpenText(skipPath));
            if (newSkip != null)
            {
                skip = newSkip.SelectMany(s => s
                    .Split(' '))
                    .Select(int.Parse)
                    .ToArray();
            }
        }

        // Lookup keys - things in sets - skip
        var missing = lookupMap.Keys
            .Except(thingSets
                .Where(s => s != null)
                .SelectMany(s => s)
                .Where(c => c.Groups != null)
                .SelectMany(s => s.Groups)
                .Where(g => g.Things != null)
                .SelectMany(g => g.Things)
                .SelectMany(t => t
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                )
            )
            .Except(skip)
            .ToArray();

        if (missing.Length > 0)
        {
            thingSets.Add(new List<DataCollectionCategory>
            {
                new DataCollectionCategory
                {
                    Name = "UNCATEGORIZED",
                    Groups = new List<DataCollectionGroup>
                    {
                        new DataCollectionGroup
                        {
                            Name = "UNCATEGORIZED",
                            Things = missing
                                .OrderBy(m => m)
                                .Select(m => m.ToString())
                                .ToList(),
                        },
                    },
                },
            });

#if DEBUG
            using (var file = File.CreateText(Path.Join(DataUtilities.DataPath, dirName, "zzz_uncategorized.yml")))
            {
                foreach (int thing in missing.OrderBy(m => m))
                {
                    file.WriteLine($"    - {thing} # {nameFunc(thing)}");
                }
            }
#endif
        }
    }

    private List<List<OutCollectionCategory>> FinalizeCollections(List<List<DataCollectionCategory>> categorySets)
    {
        var ret = new List<List<OutCollectionCategory>>(categorySets.Count);

        foreach (var categorySet in categorySets)
        {
            if (categorySet == null)
            {
                ret.Add(null);
                continue;
            }

            ret.Add(categorySet
                .Select(category => new OutCollectionCategory(category))
                .ToList()
            );
        }

        return ret;
    }

    #endregion
}
