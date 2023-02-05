using Newtonsoft.Json.Linq;
using StackExchange.Redis;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Dragonriding;
using Wowthing.Backend.Models.Data.Heirlooms;
using Wowthing.Backend.Models.Data.Illusions;
using Wowthing.Backend.Models.Data.Items;
using Wowthing.Backend.Models.Data.ItemSets;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Data.TransmogSets;
using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Backend.Models.Manual;
using Wowthing.Backend.Models.Manual.Transmog;
using Wowthing.Backend.Models.Manual.TransmogSets;
using Wowthing.Backend.Models.Manual.Vendors;
using Wowthing.Backend.Models.Manual.ZoneMaps;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheManualJob : JobBase, IScheduledJob
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
    private Dictionary<(StringType Type, Language Language, int Id), string> _stringMap;

    private int _tagIndex = 1;
    private HashSet<int> _questIds = new();
    private readonly Dictionary<string, int> _tagMap = new();

    private static readonly StringType[] StringTypes =
    {
        StringType.WowCreatureName,
        StringType.WowItemName,
        StringType.WowMountName,
    };

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.CacheManual,
        Priority = JobPriority.High,
#if DEBUG
        Interval = TimeSpan.FromMinutes(1),
#else
        Interval = TimeSpan.FromHours(1),
#endif
        Version = 23,
    };

    public override async Task Run(params string[] data)
    {
        _db = Redis.GetDatabase();
        var lastModified = await _db.DateTimeOffsetGetAsync(RedisKeys.ManualLastModified);

        var di = new DirectoryInfo(DataUtilities.DataPath);
        var latestFile = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .Where(file => !file.Name.Contains("zzz"))
            .OrderByDescending(file => file.LastWriteTimeUtc)
            .First();

        // Discard anything smaller than second resolution, oof
        var latestOffset = DateTimeOffset.FromUnixTimeSeconds(
            ((DateTimeOffset)latestFile.LastWriteTimeUtc).ToUnixTimeSeconds());

        var comparison = lastModified.CompareTo(latestOffset);
        if (comparison >= 0) // -1 = earlier, 0 = same, 1 = later
        {
            Logger.Debug("Skipping: {file} {old} {new}", latestFile.FullName, lastModified, latestOffset);
            return;
        }

        await _db.DateTimeOffsetSetAsync(RedisKeys.ManualLastModified, latestFile.LastWriteTimeUtc);

        await LoadBasicData();
        await CacheData();

        Logger.Information("{Timer}", _timer.ToString());
    }

    private string GetString(StringType type, Language language, int id)
    {
        if (!_stringMap.TryGetValue((type, language, id), out var languageName))
        {
            languageName = _stringMap.GetValueOrDefault(
                (type, language, id), $"{type.ToString()} #{id}");
        }

        return languageName;
    }

    private async Task LoadBasicData()
    {
        _itemMap = await Context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

        var itemModifiedAppearances = await Context.WowItemModifiedAppearance
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

        _mountMap = await Context.WowMount
            .AsNoTracking()
            .ToDictionaryAsync(mount => mount.Id);

        _petMap = await Context.WowPet
            .AsNoTracking()
            .Where(pet => (pet.Flags & 32) == 0)
            .ToDictionaryAsync(pet => pet.Id);

        _toyMap = await Context.WowToy
            .AsNoTracking()
            .ToDictionaryAsync(toy => toy.ItemId);

        _stringMap = await Context.LanguageString
            .AsNoTracking()
            .Where(ls => StringTypes.Contains(ls.Type))
            .ToDictionaryAsync(
                ls => (ls.Type, ls.Language, ls.Id),
                ls => ls.String
            );

        var transmogSets = (await DataUtilities.LoadDumpCsvAsync<DumpTransmogSetItem>("transmogsetitem"))
            .ToGroupedDictionary(tsi => tsi.TransmogSetID);

        var transmogSetEffects = await Context.WowItemEffect
            .AsNoTracking()
            .Where(wie => wie.Effect == WowSpellEffectEffect.LearnTransmogSet)
            .ToArrayAsync();

        _collectionItemToModifiedAppearances = transmogSetEffects
            .GroupBy(wie => wie.ItemId)
            .ToDictionary(
                group => group.Key,
                group => transmogSets.GetValueOrDefault(
                        group.OrderByDescending(wie => wie.ItemXItemEffectId)
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

    private async Task CacheData()
    {
        var cacheData = new ManualCache();

        // Mount sets
        var mountSets = LoadCollectionSets("mounts");
        AddUncategorized("mounts", _mountMap, mountSets,
            id => GetString(StringType.WowMountName, Language.enUS, id));
        cacheData.MountSets = FinalizeCollections(mountSets);
        _timer.AddPoint("Mounts");

        // Pet sets
        var petSets = LoadCollectionSets("pets");
        AddUncategorized("pets", _petMap, petSets,
            id => GetString(StringType.WowCreatureName, Language.enUS, _petMap[id].CreatureId));
        cacheData.PetSets = FinalizeCollections(petSets);
        _timer.AddPoint("Pets");

        // Toy sets
        var toySets = LoadCollectionSets("toys");
        AddUncategorized("toys", _toyMap, toySets,
            id => GetString(StringType.WowItemName, Language.enUS, id));
        cacheData.ToySets = FinalizeCollections(toySets);
        _timer.AddPoint("Toys");

        cacheData.Dragonriding = LoadDragonriding();
        _timer.AddPoint("Dragonriding");

        cacheData.HeirloomSets = LoadHeirlooms();
        _timer.AddPoint("Heirlooms");

        cacheData.IllusionSets = LoadIllusions();
        _timer.AddPoint("Illusions");

        cacheData.SharedItemSets = LoadSharedItemSets();
        _timer.AddPoint("ItemSets");

        cacheData.ProgressSets = LoadProgress();
        _timer.AddPoint("Progress");

        cacheData.TransmogSets = LoadTransmog();
        cacheData.TransmogSetsV2 = LoadTransmogSets();
        _timer.AddPoint("Transmog");

        cacheData.SharedVendors = LoadSharedVendors();
        cacheData.VendorSets = LoadVendors();
        _timer.AddPoint("Vendors");

        cacheData.ZoneMapSets = LoadZoneMaps();
        _timer.AddPoint("ZoneMaps");

        cacheData.Tags = _tagMap
            .OrderBy(kvp => kvp.Value)
            .Select(kvp => new JArray(kvp.Value, kvp.Key))
            .ToList();

        _timer.AddPoint("Tags");

#if DEBUG
        DumpZoneMapQuests(cacheData.SharedVendors, cacheData.ZoneMapSets);
#endif

        // Save the data to Redis
        string cacheJson = JsonConvert.SerializeObject(cacheData);
        string cacheHash = cacheJson.Md5();
        _timer.AddPoint("JSON");

        foreach (var language in Enum.GetValues<Language>())
        {
            Logger.Information("{Lang}", language);

            await _db.SetCacheDataAndHash($"manual-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache");

        // Save any new quest IDs
        var existingQuestIds = (await Context.WowQuest
            .Select(q => q.Id)
            .ToArrayAsync())
            .ToHashSet();

        int[] newQuestIds = _questIds.Except(existingQuestIds).ToArray();
        foreach (int questId in newQuestIds)
        {
            Context.WowQuest.Add(new WowQuest
            {
                Id = questId,
            });
        }

        await Context.SaveChangesAsync();

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
        var groups = DataUtilities.YamlDeserializer
            .Deserialize<DataHeirloomGroup[]>(
                File.OpenText(
                    Path.Join(DataUtilities.DataPath, "heirlooms", "heirlooms.yml")
                )
            );

        foreach (var group in groups)
        {
            foreach (var item in group.Items)
            {
                if (item.Upgrades == 0)
                {
                    item.Upgrades = 5;
                }
            }
        }

        return groups;
    }

    private DataIllusionGroup[] LoadIllusions()
    {
        var groups = DataUtilities.YamlDeserializer
            .Deserialize<DataIllusionGroup[]>(
                File.OpenText(
                    Path.Join(DataUtilities.DataPath, "illusions", "illusions.yml")
                )
            );

        return groups;
    }

    private List<List<OutProgress>> LoadProgress()
    {
        var progressSets = DataUtilities.LoadData<DataProgress>("progress", Logger);
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
            Logger.Debug("Parsing {file}", file.FullName);
            var itemSets = DataUtilities.YamlDeserializer.Deserialize<DataSharedItemSets>(File.OpenText(file.FullName));

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
            Logger.Debug("Parsing {file}", file.FullName);
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
                        Logger.Warning("Missing quest ID on vendor {name} sells", vendor.Name);
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
        var transmogSets = DataUtilities.LoadData<DataTransmogCategory>("transmog", Logger);

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

    private List<List<ManualTransmogSetCategory>> LoadTransmogSets()
    {
        var transmogSets = DataUtilities.LoadData<DataTransmogSetCategory>("transmog-sets", Logger);

        var ret = new List<List<ManualTransmogSetCategory>>(transmogSets.Count);
        foreach (var catList in transmogSets)
        {
            if (catList == null)
            {
                ret.Add(null);
                continue;
            }

            var newCatList = new List<ManualTransmogSetCategory>(catList.Count);
            foreach (var cat in catList)
            {
                if (cat == null)
                {
                    newCatList.Add(null);
                    continue;
                }

                foreach (var group in cat.Groups.EmptyIfNull())
                {
                    AddTags(group.MatchTags);
                }

                foreach (var set in cat.Sets.EmptyIfNull())
                {
                    AddTags(set.MatchTags);
                }

                newCatList.Add(new ManualTransmogSetCategory(cat, _tagMap));
            }
            ret.Add(newCatList);
        }

        return ret;
    }

    private List<List<ManualVendorCategory>> LoadVendors()
    {
        var vendorSets = DataUtilities.LoadData<DataVendorCategory>("vendors", Logger);

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
        var zoneMapSets = DataUtilities.LoadData<DataZoneMapCategory>("zone-maps", Logger);

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
                            Logger.Warning("Missing quest ID on farm '{name}'", farm.Name);
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
                                    Logger.Warning("Missing quest ID on farm '{name}' drop", farm.Name);
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
        var seenQuests = new HashSet<int>();
        using var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "zone-maps", "addon.txt"));

        foreach (var vendor in sharedVendors)
        {
            var questSells = vendor.Sells
                .EmptyIfNull()
                .Where(sell => sell.Type == RewardType.Quest)
                .ToArray();

            if (questSells.Length == 0)
            {
                continue;
            }

            outFile.WriteLine("    -- Vendors: {0}", vendor.Name);
            foreach (var sell in questSells)
            {
                if (!seenQuests.Contains(sell.Id))
                {
                    outFile.WriteLine("    {0}, -- ??", sell.Id);
                    seenQuests.Add(sell.Id);
                }
            }
        }

        foreach (var categories in zoneMaps.Where(zm => zm != null))
        {
            foreach (var category in categories.Where(cat => cat != null))
            {
                bool nameWritten = false;

                foreach (var farm in category.Farms)
                {
                    if (farm.Type == FarmType.Quest)
                    {
                        continue;
                    }

                    foreach (var questId in farm.QuestIds)
                    {
                        if (questId > 0 && !seenQuests.Contains(questId))
                        {
                            if (!nameWritten)
                            {
                                outFile.WriteLine("    -- Zone Maps: {0}", category.Name);
                                nameWritten = true;
                            }

                            outFile.WriteLine("    {0}, -- {1}", questId, farm.Name);
                            seenQuests.Add(questId);
                        }
                    }

                    foreach (var drop in farm.Drops)
                    {
                        var questIds = drop.QuestIds
                            .EmptyIfNull()
                            .Concat(drop.Type == "xpquest" ? new[] { drop.Id } : Array.Empty<int>())
                            .ToArray();

                        foreach (var dropQuestId in questIds)
                        {
                            if (!seenQuests.Contains(dropQuestId))
                            {
                                if (!nameWritten)
                                {
                                    outFile.WriteLine("    -- Zone Maps: {0}", category.Name);
                                    nameWritten = true;
                                }

                                outFile.WriteLine("    {0}, -- {1}", dropQuestId, farm.Name);
                                seenQuests.Add(dropQuestId);
                            }
                        }
                    }
                }
            }
        }
    }

    #region Collections

    private List<List<DataCollectionCategory>> LoadCollectionSets(string dirName)
    {
        return DataUtilities.LoadData<DataCollectionCategory>(dirName, Logger);
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
