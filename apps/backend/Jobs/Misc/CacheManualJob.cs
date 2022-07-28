using StackExchange.Redis;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Heirlooms;
using Wowthing.Backend.Models.Data.Items;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Backend.Models.Manual;
using Wowthing.Backend.Models.Manual.Transmog;
using Wowthing.Backend.Models.Manual.Vendors;
using Wowthing.Backend.Models.Manual.ZoneMaps;
using Wowthing.Backend.Models.Static;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheManualJob : JobBase, IScheduledJob
{
    private readonly HashSet<int> _itemIds = new();
    private readonly JankTimer _timer = new JankTimer();

    private readonly IDeserializer _yaml = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .IgnoreUnmatchedProperties()
        .Build();

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

    private readonly StringType[] _stringTypes =
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
        Version = 6,
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

        _timer.AddPoint("Cache", true);

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
                group => group.ToDictionary(
                    ima => ima.Modifier,
                    ima => ima.AppearanceId
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
            .Where(ls => _stringTypes.Contains(ls.Type))
            .ToDictionaryAsync(
                ls => (ls.Type, ls.Language, ls.Id),
                ls => ls.String
            );

        var transmogSets = (await DataUtilities.LoadDumpCsvAsync<DumpTransmogSetItem>("transmogsetitem"))
            .ToGroupedDictionary(tsi => tsi.TransmogSetID);

        _collectionItemToModifiedAppearances = await Context.WowItemEffect
            .AsNoTracking()
            .Where(wie => wie.Effect == WowSpellEffectEffect.LearnTransmogSet)
            .ToDictionaryAsync(
                wie => wie.ItemId,
                wie => transmogSets[wie.Values[0]]
                    .Select(tsi => tsi.ItemModifiedAppearanceID)
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
        AddUncategorized("mounts", _mountMap, mountSets, id => GetString(StringType.WowMountName, Language.enUS, id));
        cacheData.MountSets = FinalizeCollections(mountSets);
        _timer.AddPoint("Mounts");

        // Pet sets
        var petSets = LoadCollectionSets("pets");
        AddUncategorized("pets", _petMap, petSets, id => GetString(StringType.WowCreatureName, Language.enUS, id));
        cacheData.PetSets = FinalizeCollections(petSets);
        _timer.AddPoint("Pets");

        // Toy sets
        var toySets = LoadCollectionSets("toys");
        AddUncategorized("toys", _toyMap, toySets, id => GetString(StringType.WowItemName, Language.enUS, id));
        cacheData.ToySets = FinalizeCollections(toySets);
        _timer.AddPoint("Toys");

        // Heirlooms
        cacheData.HeirloomSets = LoadHeirlooms();

        // Progress
        cacheData.ProgressSets = LoadProgress();

        // Shared vendors
        cacheData.SharedVendors = LoadSharedVendors();

        // Transmog
        cacheData.TransmogSets = LoadTransmog();

        // Vendors
        cacheData.VendorSets = LoadVendors();

        // Zone Maps
        cacheData.ZoneMapSets = LoadZoneMaps();
#if DEBUG
        DumpZoneMapQuests(cacheData.ZoneMapSets);
#endif

        // Save the data to Redis
        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            Logger.Information("{Lang}", language);

            cacheData.SharedItems = _itemIds
                .OrderBy(itemId => itemId)
                .Select(itemId => new StaticItem(_itemMap[itemId])
                {
                    AppearanceIds = _itemToAppearance.GetValueOrDefault(itemId),
                    Name = GetString(StringType.WowItemName, language, itemId),
                })
                .ToArray();

            var cacheJson = JsonConvert.SerializeObject(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await _db.SetCacheDataAndHash($"manual-{language.ToString()}", cacheJson, cacheHash);
        }
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

    private List<List<OutProgress>> LoadProgress()
    {
        var ret = new List<List<OutProgress>>();

        var progressSets = DataUtilities.LoadData<DataProgress>("progress", Logger);
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

    private List<ManualSharedVendor> LoadSharedVendors()
    {
        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "_shared", "vendor"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var ret = new List<ManualSharedVendor>();

        foreach (var file in files)
        {
            Logger.Debug("Parsing {file}", file.FullName);
            var vendor = _yaml.Deserialize<DataSharedVendor>(File.OpenText(file.FullName));
            ret.Add(new ManualSharedVendor(vendor));
        }

        foreach (var vendor in ret)
        {
            foreach (var item in vendor.Sells)
            {
                DoCommonItemStuff(item);
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

        var ret = new List<List<ManualTransmogCategory>>();

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
        var vendorSets = DataUtilities.LoadData<DataVendorCategory>("vendors", Logger);

        var ret = new List<List<ManualVendorCategory>>();
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
            _itemIds.Add(item.Id);

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
                    dropItem.SubclassId == 5 ||
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

        // Costs with an ID >1 million are items
        foreach (var (currencyId, amount) in item.Costs.EmptyIfNull())
        {
            if (currencyId > 1_000_000)
            {
                _itemIds.Add(currencyId - 1_000_000);
            }
        }
    }

    private List<List<ManualZoneMapCategory>> LoadZoneMaps()
    {
        var zoneMapSets = DataUtilities.LoadData<DataZoneMapCategory>("zone-maps", Logger);

        var ret = new List<List<ManualZoneMapCategory>>();

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

        // Change transmog itemId to appearanceId
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

                    foreach (var drop in farm.Drops)
                    {
                        switch (drop.Type)
                        {
                            case "mount":
                            case "pet":
                            case "toy":
                                break;

                            case "item":
                                _itemIds.Add(drop.Id);
                                break;

                            case "transmog":
                            {
                                _itemIds.Add(drop.Id);

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

    private void DumpZoneMapQuests(List<List<ManualZoneMapCategory>> zoneMaps)
    {
        var seenQuests = new HashSet<int>();
        using (var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "zone-maps", "addon.txt")))
        {
            foreach (var categories in zoneMaps.Where(zm => zm != null))
            {
                foreach (var category in categories.Where(cat => cat != null))
                {
                    outFile.WriteLine("    -- Zone Maps: {0}", category.Name);
                    foreach (var farm in category.Farms)
                    {
                        foreach (var questId in farm.QuestIds)
                        {
                            if (questId > 0 && !seenQuests.Contains(questId))
                            {
                                outFile.WriteLine("    {0}, -- {1}", questId, farm.Name);
                                seenQuests.Add(questId);
                            }
                        }

                        foreach (var drop in farm.Drops)
                        {
                            foreach (var dropQuestId in drop.QuestIds.EmptyIfNull())
                            {
                                if (!seenQuests.Contains(dropQuestId))
                                {
                                    outFile.WriteLine("    {0}, -- {1}", dropQuestId, farm.Name);
                                    seenQuests.Add(dropQuestId);
                                }
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
            var newSkip = _yaml.Deserialize<string[]>(File.OpenText(skipPath));
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
                    file.WriteLine($"  - {thing} # {nameFunc(thing)}");
                }
            }
#endif
        }
    }


    private List<List<OutCollectionCategory>> FinalizeCollections(List<List<DataCollectionCategory>> categorySets)
    {
        var ret = new List<List<OutCollectionCategory>>();

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
