using System.ComponentModel.DataAnnotations;
using System.Numerics;
using System.Reflection;
using Serilog.Context;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Instances;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.Journal;

namespace Wowthing.Tool.Tools;

public class JournalTool
{
    private readonly JankTimer _timer = new();

    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<int, int> _itemEffectIllusionMap;
    private Dictionary<int, WowMount> _mountMap;
    private Dictionary<int, WowPet> _petMap;
    private Dictionary<int, WowToy> _toyMap;
    private Dictionary<int, WowTransmogSet[]> _transmogSetsByGroup;
    private Dictionary<(StringType Type, Language language, int Id), string> _stringMap;
    private HashSet<int> _recipeItemIds = [];
    private readonly HashSet<int> _completeQuestItemIds = [];
    private readonly HashSet<int> _teachesDecorItemIds = [];
    private readonly HashSet<int> _teachesSpellItemIds = [];
    private readonly HashSet<int> _transmogSetItemIds = [];

    private readonly int[] _raidNormals = [3, 4, 14];
    private readonly int[] _raidHeroics = [5, 6, 15];

    private readonly int[] _difficultyOrder =
    {
        1, // Dungeon Normal
        2, // Dungeon Heroic
        8, // Dungeon Mythic Keystone
        23, // Dungeon Mythic
        24, // Dungeon Timewalking
        7, // Legacy LFR
        3, // 10 Normal
        4, // 10 Heroic
        5, // 25 Normal
        6, // 25 Heroic
        9, // 40 Player
        17, // Raid LFR
        14, // Raid Normal
        15, // Raid Heroic
        16, // Raid Mythic
        33, // Raid Timewalking
    };

    private readonly int[] _classMaskOrder =
    {
        0b0000_0000_1000_0000, // Mage
        0b0000_0000_0001_0000, // Priest
        0b0000_0001_0000_0000, // Warlock

        0b0000_1000_0000_0000, // Demon Hunter
        0b0000_0100_0000_0000, // Druid
        0b0000_0010_0000_0000, // Monk
        0b0000_0000_0000_1000, // Rogue

        0b0001_0000_0000_0000, // Evoker
        0b0000_0000_0000_0100, // Hunter
        0b0000_0000_0100_0000, // Shaman

        0b0000_0000_0010_0000, // Death Knight
        0b0000_0000_0000_0010, // Paladin
        0b0000_0000_0000_0001, // Warrior
    };

    private readonly StringType[] _stringTypes = {
        StringType.WowItemName,
        StringType.WowJournalEncounterName,
        StringType.WowJournalInstanceName,
        StringType.WowJournalTierName,
    };

    private static readonly HashSet<int> InstanceTimewalkingOverride =
    [
        78, // Firelands
        751, // Black Temple
        759, // Ulduar
    ];

    private static readonly Dictionary<string, Dictionary<string, int>> _dataInstanceDifficulties = new()
    {
        { "DUNGEON", new() {
            { "NORMAL", 1 },
            { "HEROIC", 2 },
            { "MYTHIC", 8 },
            { "TIMEWALKING", 24 },
        } },
        { "RAID", new()
        {
            { "10NORMAL", 3 },
            { "25NORMAL", 4 },
            { "10HEROIC", 5 },
            { "25HEROIC", 6 },
            { "OLDLFR", 7 },
            { "LFR", 17 },
            { "NORMAL", 14 },
            { "HEROIC", 15 },
            { "MYTHIC", 16 },
        } },
    };

    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Journal");
        await using var context = ToolContext.GetDbContext();
        var db = ToolContext.Redis.GetDatabase();

        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "statistics"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var statisticsMap = new Dictionary<int, Dictionary<int, int[]>>();
        foreach (var file in files)
        {
            ToolContext.Logger.Debug("Parsing {file}", file.FullName);
            var data = DataUtilities.YamlDeserializer
                .Deserialize<Dictionary<int, Dictionary<int, string>>>(File.OpenText(file.FullName));

            foreach (var (encounterId, difficulties) in data)
            {
                if (!statisticsMap.ContainsKey(encounterId))
                {
                    statisticsMap[encounterId] = new();
                }

                foreach (var (difficulty, statisticIds) in difficulties)
                {
                    statisticsMap[encounterId][difficulty] = statisticIds
                        .Split()
                        .Select(int.Parse)
                        .ToArray();
                }
            }
        }

        _timer.AddPoint("Data");

        var tiers = (await DataUtilities.LoadDumpCsvAsync<DumpJournalTier>("journaltier"))
            .OrderByDescending(djt => djt.ID)
            .ToList();

        var mapsById = (await DataUtilities.LoadDumpCsvAsync<DumpMap>("map"))
            .ToDictionary(map => map.ID);

        var instancesById = (await DataUtilities.LoadDumpCsvAsync<DumpJournalInstance>("journalinstance"))
            .ToDictionary(instance => instance.ID);

        var tierToInstances = (await DataUtilities.LoadDumpCsvAsync<DumpJournalTierXInstance>("journaltierxinstance"))
            .GroupBy(x => x.JournalTierID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Where(group2 => group2.MaybePlayerConditionID is 0 or 129245)
                    .GroupBy(group2 => group2.MaybePlayerConditionID)
                    .OrderByDescending(group2 => group2.Key)
                    .First()
                    .Where(jtxi =>
                        instancesById.ContainsKey(jtxi.JournalInstanceID) &&
                        mapsById.ContainsKey(instancesById[jtxi.JournalInstanceID].MapID)
                    )
                    .OrderBy(jtxi => mapsById[instancesById[jtxi.JournalInstanceID].MapID].InstanceType)
                    //.ThenBy(jtxi => mapsById[instancesById[jtxi.JournalInstanceID].MapID].ExpansionID)
                    .ThenBy(jtxi => jtxi.OrderIndex)
                    .ThenBy(jtxi => instancesById[jtxi.JournalInstanceID].Name)
                    .Select(jtxi => jtxi.JournalInstanceID)
                    .ToArray()
            );

        var encountersByInstanceId = (await DataUtilities.LoadDumpCsvAsync<DumpJournalEncounter>("journalencounter"))
            .GroupBy(encounter => encounter.JournalInstanceID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(encounter => encounter.OrderIndex)
                    .ToList()
            );

        var itemsByEncounterId = (await DataUtilities.LoadDumpCsvAsync<DumpJournalEncounterItem>("journalencounteritem"))
            .ToGroupedDictionary(item => item.JournalEncounterID);

        var difficultiesByEncounterItemId = (await DataUtilities.LoadDumpCsvAsync<DumpJournalItemXDifficulty>("journalitemxdifficulty"))
            .ToGroupedDictionary(
                ixd => ixd.JournalEncounterItemID,
                ixd => ixd.DifficultyID
            );

        var difficultiesByMapId = (await DataUtilities.LoadDumpCsvAsync<DumpMapDifficulty>("mapdifficulty"))
            .ToGroupedDictionary(
                md => md.MapID,
                md => md.DifficultyID
            );

        var itemModifiedAppearances = await context.WowItemModifiedAppearance.ToArrayAsync();

        var appearancesById = itemModifiedAppearances.ToDictionary(ima => ima.Id);

        // { itemId => { modifierId => appearanceId } }
        var appearancesByItemId = itemModifiedAppearances
            .GroupBy(ima => ima.ItemId)
            .ToDictionary(
                itemIdGroup => itemIdGroup.Key,
                itemIdGroup => itemIdGroup
                    .GroupBy(ima => ima.Modifier)
                    .ToDictionary(
                        modifierGroup => modifierGroup.Key,
                        modifierGroup => modifierGroup
                            .OrderByDescending(ima => ima.Id)
                            .Select(ima => ima.AppearanceId)
                            .First()
                    )
            );

        var bonusAppearanceModifiers = (await DataUtilities.LoadDumpCsvAsync<DumpItemBonus>("itembonus"))
            .Where(ib => ib.Type == 7) // TODO fix hardcoded
            .GroupBy(ib => ib.ParentItemBonusListID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(ib => ib.OrderIndex)
                    .First()
                    .Value0
            );

        _timer.AddPoint("Dumps");

        _itemMap = await context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

        _itemEffectIllusionMap = await context.WowItemEffect
            .AsNoTracking()
            .Where(effect => effect.Effect == WowSpellEffectEffect.LearnTransmogIllusion)
            .ToDictionaryAsync(effect => effect.ItemId, effect => effect.Values[0]);

        _mountMap = (
            await context.WowMount
                .AsNoTracking()
                .Where(mount => mount.ItemIds.Count > 0)
                .ToArrayAsync()
            )
            .ToManyDictionary(mount => mount.ItemIds, mount => mount);

        _petMap = (
            await context.WowPet
                .AsNoTracking()
                .Where(pet => pet.ItemIds.Count > 0 && (pet.Flags & 32) == 0)
                .ToArrayAsync()
            )
            .ToManyDictionary(pet => pet.ItemIds, pet => pet);

        _toyMap = await context.WowToy
            .AsNoTracking()
            .ToDictionaryAsync(toy => toy.ItemId);

        _stringMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => _stringTypes.Contains(ls.Type))
            .ToDictionaryAsync(ls => (ls.Type, ls.Language, ls.Id), ls => ls.String);

        _transmogSetsByGroup = (await context.WowTransmogSet
            .Where(set => set.GroupId > 0)
            .ToArrayAsync())
            .ToGroupedDictionary(set => (int)set.GroupId);

        var recipeItemIds = await context.WowProfessionRecipeItem
            .AsNoTracking()
            .Select(wpri => wpri.ItemId)
            .Distinct()
            .ToArrayAsync();
        _recipeItemIds = new HashSet<int>(recipeItemIds);

        foreach (var item in _itemMap.Values)
        {
            if (item.CompletesQuestIds.Length > 0)
            {
                _completeQuestItemIds.Add(item.Id);
            }

            if (item.TeachesDecorIds.Length > 0)
            {
                _teachesDecorItemIds.Add(item.Id);
            }

            if (item.TeachesSpellIds.Length > 0)
            {
                _teachesSpellItemIds.Add(item.Id);
            }

            if (item.TeachesTransmogSetIds.Length > 0)
            {
                _transmogSetItemIds.Add(item.Id);
            }
        }

        _timer.AddPoint("Database");

        var itemExpansions = DataUtilities.LoadItemExpansions();
        var dataInstanceMap = LoadInstances();

        _timer.AddPoint("Files");

        var languages = Enum.GetValues<Language>().ToArray();

        var encounterIdToSlug = new Dictionary<int, string>();
        foreach (var encounter in encountersByInstanceId.Values.SelectMany(e => e))
        {
            encounterIdToSlug[encounter.ID] =
                GetString(StringType.WowJournalEncounterName, Language.enUS, encounter.ID).Slugify();
        }

        // Add extra tiers
        foreach (var (tier, dungeons) in Hardcoded.ExtraTiers)
        {
            tiers.Add(tier);
            tierToInstances[tier.ID] = dungeons
                .Select(dungeon => dungeon.ID)
                .ToArray();

            foreach (var language in languages)
            {
                _stringMap[(StringType.WowJournalTierName, language, tier.ID)] = tier.Name;
            }

            foreach (var dungeon in dungeons)
            {
                instancesById[dungeon.ID] = dungeon;
                encountersByInstanceId[dungeon.ID] = new List<DumpJournalEncounter>();

                foreach (var language in languages)
                {
                    _stringMap[(StringType.WowJournalInstanceName, language, dungeon.ID)] = dungeon.Name;
                }
            }
        }

        // Add extra encounters
        foreach (var (instanceId, extraEncounters) in Hardcoded.ExtraEncounters)
        {
            for (int i = extraEncounters.Length - 1; i >= 0; i--)
            {
                var extraEncounter = extraEncounters[i];
                int encounterId = 100000 + (instanceId * 10) + i;

                var encounter = new DumpJournalEncounter
                {
                    ID = encounterId,
                    OrderIndex = -i,
                };

                if (extraEncounter.AfterEncounter.HasValue)
                {
                    for (int j = 0; j < encountersByInstanceId[instanceId].Count; j++)
                    {
                        if (encountersByInstanceId[instanceId][j].ID == extraEncounter.AfterEncounter.Value)
                        {
                            encountersByInstanceId[instanceId].Insert(j + 1, encounter);
                            break;
                        }
                    }
                }
                else
                {
                    encountersByInstanceId[instanceId].Insert(0, encounter);
                }

                foreach (var language in languages)
                {
                    _stringMap[(StringType.WowJournalEncounterName, language, encounterId)] = extraEncounter.Name;
                }
            }
        }

        foreach (var (encounterId, extraDrops) in Hardcoded.ExtraItemDrops)
        {
            int instanceId = encounterId % 1_000_000;

            if (encounterId is > 2_000_000 and < 3_000_000)
            {
                // Shared drops
                encountersByInstanceId[instanceId].Insert(0, new DumpJournalEncounter
                {
                    ID = encounterId,
                    OrderIndex = -9,
                });
            }
            else if (encounterId is > 1_000_000 and < 2_000_000)
            {
                // Trash drops
                encountersByInstanceId[instanceId].Insert(0, new DumpJournalEncounter
                {
                    ID = encounterId,
                    OrderIndex = -10,
                });
            }
        }

        foreach (int instanceId in Hardcoded.JournalInstanceTransmogSets.Keys)
        {
            encountersByInstanceId[instanceId].Insert(0, new DumpJournalEncounter
            {
                ID = 3_000_000 + instanceId,
                OrderIndex = -12,
            });
        }

        foreach (var (instanceId, dataInstance) in dataInstanceMap)
        {
            var instanceEncounters = encountersByInstanceId[instanceId];

            if (dataInstance.Encounters.ContainsKey("shared-drops"))
            {
                instanceEncounters.Insert(0, new DumpJournalEncounter
                {
                    ID = 2_000_000 + instanceId,
                    OrderIndex = -9,
                });
            }

            if (dataInstance.Encounters.ContainsKey("trash-drops"))
            {
                instanceEncounters.Insert(0, new DumpJournalEncounter
                {
                    ID = 1_000_000 + instanceId,
                    OrderIndex = -10,
                });
            }

            if (dataInstance.Encounters.ContainsKey("vendors"))
            {
                instanceEncounters.Insert(0, new DumpJournalEncounter
                {
                    ID = 4_000_000 + instanceId,
                    OrderIndex = -11,
                });
            }

            foreach (var dataEncounter in dataInstance.Encounters.Values)
            {
                if (string.IsNullOrWhiteSpace(dataEncounter.AddBefore) && string.IsNullOrWhiteSpace(dataEncounter.AddAfter))
                {
                    continue;
                }

                for (int i = instanceEncounters.Count - 1; i > 0; i--)
                {
                    var instanceEncounter = instanceEncounters[i];
                    if (!encounterIdToSlug.TryGetValue(instanceEncounter.ID, out string encounterSlug))
                    {
                        continue;
                    }

                    bool addBefore = dataEncounter.AddBefore == encounterSlug;
                    bool addAfter = dataEncounter.AddAfter == encounterSlug;
                    if (!addBefore && !addAfter)
                    {
                        continue;
                    }

                    int encounterId = 100000 + (instanceId * 10) + i;
                    var newEncounter = new DumpJournalEncounter
                    {
                        ID = encounterId,
                        OrderIndex = -i,
                    };

                    if (addBefore)
                    {
                        instanceEncounters.Insert(i, newEncounter);
                    }
                    else if (i == (instanceEncounters.Count - 1))
                    {
                        instanceEncounters.Add(newEncounter);
                    }
                    else
                    {
                        instanceEncounters.Insert(i + 1, newEncounter);
                    }

                    foreach (var language in languages)
                    {
                        _stringMap[(StringType.WowJournalEncounterName, language, encounterId)] = dataEncounter.Name!;
                    }
                }
            }
        }

        // Once per language, oh boy
        string cacheHash = null;
        foreach (var language in languages)
        {
            ToolContext.Logger.Debug("Generating {Lang}", language);

            var cacheData = new RedisJournalData
            {
                ItemExpansion = itemExpansions,
            };

            foreach (var tier in tiers)
            {
                var tierData = new OutJournalTier
                {
                    Id = tier.ID,
                    Name = GetString(StringType.WowJournalTierName, language, tier.ID),
                    Slug = GetString(StringType.WowJournalTierName, Language.enUS, tier.ID).Slugify(),
                };

                var legacyLoot = tier.ID <= 499; // Shadowlands

                int lastInstanceType = -1;
                foreach (short instanceId in tierToInstances[tier.ID])
                {
                    if (Hardcoded.SkipInstances.Contains(instanceId))
                    {
                        continue;
                    }

                    var instance = instancesById[instanceId];
                    var map = mapsById[instance.MapID];

                    dataInstanceMap.TryGetValue(instanceId, out var dataInstance);

                    bool hasTimewalking = InstanceTimewalkingOverride.Contains(instance.ID) || (instance.Flags & 0x1) == 0x1;

                    if (Hardcoded.JournalDungeonsOnly.Contains(tier.ID) && map.InstanceType != 1)
                    {
                        continue;
                    }

                    if (lastInstanceType == -1)
                    {
                        lastInstanceType = map.InstanceType;
                    }
                    else if (lastInstanceType != map.InstanceType)
                    {
                        lastInstanceType = map.InstanceType;
                        tierData.Instances.Add(null);
                    }

                    // Remove "Story" difficulty
                    int[] mapDifficulties = difficultiesByMapId[instance.MapID]
                        .Where(difficulty => difficulty != 220)
                        .ToArray();

                    // If the instance does not have the Timewalking flag, remove it from the difficulties
                    if (!hasTimewalking)
                    {
                        mapDifficulties = mapDifficulties
                            .Where(difficulty => difficulty != 24 && difficulty != 33)
                            .ToArray();
                    }

                    // Current Season hack
                    if (tier.ID == 505)
                    {
                        mapDifficulties = mapDifficulties
                            .Where(difficulty => difficulty == 8)
                            .ToArray();
                    }

                    // Some dungeons don't have a Timewalking map difficulty, check for the TW flag and manually
                    // add the damn thing
                    // if (map.InstanceType == 1 && (instance.Flags & 0x1) == 0x1 && !mapDifficulties.Contains(24))
                    // {
                    //     mapDifficulties = mapDifficulties.Concat(new[] { 24 }).ToArray();
                    // }

                    var hadDifficulties = Hardcoded.InstanceDifficulties
                        .TryGetValue((tier.ID, instanceId), out int[] difficulties);

                    var instanceData = new OutJournalInstance
                    {
                        Id = instance.ID,
                        Name = GetString(StringType.WowJournalInstanceName, language, instance.ID),
                        Slug = GetString(StringType.WowJournalInstanceName, Language.enUS, instance.ID).Slugify(),
                    };

                    if (Hardcoded.InstanceBonusIds.TryGetValue(instanceId, out var bonusIds))
                    {
                        instanceData.BonusIds = bonusIds;
                    }

                    var encounters = encountersByInstanceId[instanceId];

                    // Force sort order
                    if (Hardcoded.JournalBossOrder.TryGetValue(instanceId, out var bossOrder))
                    {
                        encounters = encounters
                            .OrderBy(encounter => Array.IndexOf(bossOrder, encounter.ID))
                            .ToList();
                    }

                    foreach (var encounter in encounters)
                    {
                        if (Hardcoded.IgnoredJournalEncounter.Contains(encounter.ID))
                        {
                            continue;
                        }

                        if (Hardcoded.JournalEncounterDifficulties.TryGetValue(encounter.ID, out int[] encounterDifficulties))
                        {
                            if (!encounterDifficulties.Intersect(difficulties).Any())
                            {
                                ToolContext.Logger.Debug("Skipping encounter {Id} {Name}", encounter.ID, encounter.Name);
                                continue;
                            }
                        }

                        statisticsMap.TryGetValue(encounter.ID, out var statistics);
                        var encounterData = new OutJournalEncounter
                        {
                            Id = encounter.ID,
                            Flags = encounter.Flags,
                            Statistics = statistics,
                        };

                        encounterData.Name = GetEncounterName(encounter.ID, language);

                        string encounterSlug = encounterIdToSlug.GetValueOrDefault(encounter.ID, encounterData.Name.Slugify());
                        var encounterItems = new List<DumpJournalEncounterItem>(itemsByEncounterId.GetValueOrDefault(encounter.ID, []));

                        // Extra drops get added first
                        foreach (var extraItem in Hardcoded.ExtraItemDrops.GetValueOrDefault(encounter.ID, []))
                        {
                            // ToolContext.Logger.Debug("Adding extra items for encounter {Id}", encounter.ID);
                            difficultiesByEncounterItemId[1000000 + extraItem.ItemId] = extraItem.Difficulties.ToArray();
                            encounterItems.Add(new DumpJournalEncounterItem
                            {
                                ID = 1000000 + extraItem.ItemId,
                                DifficultyMask = 0,
                                FactionMask = 0,
                                Flags = 0,
                                ItemID = extraItem.ItemId,
                                JournalEncounterID = encounter.ID,
                            });
                        }

                        // DataInstances
                        if (!string.IsNullOrEmpty(encounterSlug) &&
                            dataInstance != null &&
                            dataInstance.Encounters.TryGetValue(encounterSlug, out var dataInstanceEncounter))
                        {
                            foreach (var dataContent in dataInstanceEncounter.Contents.EmptyIfNull())
                            {
                                var dropDifficultiesString = string.IsNullOrEmpty(dataContent.Difficulties)
                                    ? dataInstance.Difficulties
                                    : dataContent.Difficulties;
                                var parts = dropDifficultiesString.Split('_');
                                int[] dropDifficulties = parts.Skip(1)
                                    .Select(part => _dataInstanceDifficulties[parts[0]][part])
                                    .ToArray();
                                difficultiesByEncounterItemId[1_000_000 + dataContent.ItemId] = dropDifficulties;

                                encounterItems.Add(new DumpJournalEncounterItem
                                {
                                    ID = 1000000 + dataContent.ItemId,
                                    DifficultyMask = 0,
                                    FactionMask = 0,
                                    Flags = 0,
                                    ItemID = dataContent.ItemId,
                                    JournalEncounterID = encounter.ID,
                                });
                            }
                        }

                        // Now do item expansion
                        var fakeItems = new Dictionary<int, DumpJournalEncounterItem>();
                        var items = new List<DumpJournalEncounterItem>();

                        foreach (var encounterItem in encounterItems)
                        {
                            // Don't expand ToC
                            if (!((instance.ID is 757) && encounter.ID < 1000000) &&
                                itemExpansions.TryGetValue(encounterItem.ItemID, out var expandedItems))
                            {
                                // ToolContext.Logger.Information("Expanding items for {tier} {instance} {encounter} {item}", tier.ID, instance.ID, encounter.ID, encounterItem.ItemID);
                                foreach (int itemId in expandedItems)
                                {
                                    if (!fakeItems.ContainsKey(itemId))
                                    {
                                        fakeItems[itemId] = new DumpJournalEncounterItem
                                        {
                                            ID = encounterItem.ID,
                                            DifficultyMask = encounterItem.DifficultyMask,
                                            FactionMask = encounterItem.FactionMask,
                                            Flags = encounterItem.Flags,
                                            ItemID = itemId,
                                            JournalEncounterID = encounter.ID,
                                        };
                                    }
                                }

                                cacheData.TokenEncounters.Add($"{tier.ID}");
                                cacheData.TokenEncounters.Add($"{tier.ID}|{instance.ID}");
                                cacheData.TokenEncounters.Add($"{tier.ID}|{instance.ID}|{encounter.ID}");
                            }
                            else
                            {
                                items.Add(encounterItem);
                            }
                        }

                        // Transmog set groups
                        if (encounter.ID > 3_000_000)
                        {
                            if (Hardcoded.JournalInstanceTransmogSets.TryGetValue(instance.ID,
                                    out int transmogSetGroupId) &&
                                _transmogSetsByGroup.TryGetValue(transmogSetGroupId, out var transmogSets))
                            {
                                // Assume class-based for now
                                // var itemIds = new HashSet<int>();
                                foreach (var transmogSet in transmogSets)
                                {
                                    foreach (int imaId in transmogSet.ItemModifiedAppearanceIds.Where(id =>
                                                 id > 10_000_000))
                                    {
                                        if (appearancesById.TryGetValue(imaId % 10_000_000, out var modifiedAppearance))
                                        {
                                            fakeItems[modifiedAppearance.ItemId] = new DumpJournalEncounterItem
                                            {
                                                ID = 3000000 + modifiedAppearance.ItemId,
                                                DifficultyMask = 0,
                                                FactionMask = 0,
                                                Flags = 0,
                                                ItemID = modifiedAppearance.ItemId,
                                                JournalEncounterID = encounter.ID,
                                            };
                                        }
                                    }
                                }

                                // foreach (int itemId in itemIds)
                                // {
                                //     // difficultiesByEncounterItemId[3_000_000 + itemId] = extraItem.Difficulties.ToArray();
                                //     encounterItems.Add(new DumpJournalEncounterItem
                                //     {
                                //         ID = 3000000 + itemId,
                                //         DifficultyMask = 0,
                                //         FactionMask = 0,
                                //         Flags = 0,
                                //         ItemID = itemId,
                                //         JournalEncounterID = encounter.ID,
                                //     });
                                // }
                            }
                        }

                        items.AddRange(fakeItems.Values);
                        // } // if (encounter.ID > 1000000)

                        var itemGroups = new Dictionary<string, OutJournalEncounterItemGroup>();
                        foreach (var encounterItem in items)
                        {
                            if (Hardcoded.IgnoredJournalItems.Contains(encounterItem.ItemID))
                            {
                                //Logger.Debug("Skipping ignored item {Id}", encounterItem.ItemID);
                                continue;
                            }

                            if (!_itemMap.TryGetValue(encounterItem.ItemID, out var item))
                            {
                                //Logger.Warning("No item for ID {Id}", encounterItem.ItemID);
                                continue;
                            }

                            if (item.InventoryType is WowInventoryType.Finger or WowInventoryType.Neck or WowInventoryType.Relic)
                            {
                                continue;
                            }

                            bool difficultiesOverridden = false;
                            // Nerub-ar Palace mythic mount
                            // if (item.Id == 224151)
                            // {
                            //     difficultiesOverridden = true;
                            //     difficulties = [16];
                            // }
                            if (!hadDifficulties)
                            {
                                difficulties = difficultiesByEncounterItemId.GetValueOrDefault(encounterItem.ID, []);

                                if (tier.ID == 505 &&
                                    encounterItem.WorldStateExpressionID is 44658 or 44659 &&
                                    difficulties.Length > 0)
                                {
                                    // ToolContext.Logger.Information("505: {id} {field} difficulties {diff}",
                                    //     encounterItem.ID,
                                    //     encounterItem.Field_11_0_2_55959_007,
                                    //     string.Join(", ", difficulties));

                                    // WorldStateExpression
                                    // 44659 = func?(574, 0) != 1 && func?(576, 0) == 1
                                    //
                                    // 574 = AdventureJournal -> Heroic Dungeon
                                    // 576 = AdventureJournal -> Mythic Dungeon
                                    if (encounterItem.WorldStateExpressionID == 44658)
                                    {
                                        // 44658 = func?(574, 0) == 1 && func?(576, 0) == 0
                                        // !heroic && mythic ?
                                        difficulties = difficulties.Where(difficulty => difficulty == 8).ToArray();
                                    }
                                    else if (encounterItem.WorldStateExpressionID == 44659)
                                    {
                                        // heroic && !mythic ?
                                        difficulties = difficulties.Where(difficulty => difficulty == 2).ToArray();
                                    }

                                    if (difficulties.Length == 0)
                                    {
                                        ToolContext.Logger.Warning("No valid HACK difficulties for item ID {Id}", encounterItem.ID);
                                        continue;
                                    }
                                }
                                else if (difficulties.Length > 0)
                                {
                                    difficultiesOverridden = true;

                                    // Timewalking hack
                                    if (!hasTimewalking)
                                    {
                                        difficulties = difficulties
                                            .Where(difficulty => difficulty != 24 && difficulty != 33)
                                            .ToArray();
                                    }

                                    // Current Season hack
                                    if (tier.ID == 505)
                                    {
                                        // ToolContext.Logger.Information("EncounterItem {id} difficulties {d}", encounterItem.ID, string.Join(", ", difficulties));

                                        difficulties = difficulties
                                            .Where(difficulty => difficulty == 8)
                                            .ToArray();
                                        if (difficulties.Length == 0)
                                        {
                                            // ToolContext.Logger.Warning("No mythic difficulty for encounter item {Id}", encounterItem.ID);
                                            continue;
                                        }
                                    }

                                    if (difficulties.Length == 0)
                                    {
                                        // ToolContext.Logger.Warning("No valid difficulties for item ID {Id}", encounterItem.ID);
                                        continue;
                                    }
                                }
                                else
                                {
                                    difficulties = mapDifficulties;
                                    // ToolContext.Logger.Warning("No difficulties for encounter item {Id}", encounterItem.ID);
                                    // continue;
                                }
                            }

                            if (!appearancesByItemId.TryGetValue(item.Id, out var appearances))
                            {
                                if (_mountMap.ContainsKey(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Mount, item, difficulties);
                                }
                                else if (_petMap.ContainsKey(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Pet, item, difficulties);
                                }
                                else if (_toyMap.ContainsKey(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Toy, item, difficulties);
                                }
                                else if (_recipeItemIds.Contains(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Recipe, item, difficulties);
                                }
                                else if (_transmogSetItemIds.Contains(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Transmog, item, difficulties);
                                }
                                else if (_completeQuestItemIds.Contains(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Quest, item, difficulties);
                                }
                                else if (_teachesSpellItemIds.Contains(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Spell, item, difficulties);
                                }
                                else if (_teachesDecorItemIds.Contains(item.Id))
                                {
                                    AddGroupSpecial(itemGroups, RewardType.Decor, item, difficulties);
                                }
                                else
                                {
                                    string itemName = GetString(StringType.WowItemName, Language.enUS, item.Id);
                                    if (itemName.StartsWith("Illusion:") && _itemEffectIllusionMap.TryGetValue(item.Id, out int illusionId))
                                    {
                                        AddGroupSpecial(itemGroups, RewardType.Illusion, item, difficulties, illusionId);
                                    }
                                    // else if (itemName.StartsWith(""))
                                }
                                // else
                                // {
                                //     ToolContext.Logger.Debug("No appearances for ID {Id}", item.Id);
                                // }

                                continue;
                            }

                            // Skip any items that aren't for this difficulty
                            // TODO handle multiple difficulties better
                            if (!difficultiesOverridden && encounterItem.DifficultyMask > 0 && difficulties?.Length >= 1)
                            {
                                var forThis = (
                                    // Basic difficulty mask check
                                    difficulties.Any(diff => (encounterItem.DifficultyMask & (1 << (diff - 1))) > 0) ||
                                    // Flex-normal check for old 10/25 normal flags
                                    (difficulties.Contains(14) && (encounterItem.DifficultyMask & 12) > 0) ||
                                    // Flex-heroic check for old 10/25 heroic flags
                                    (difficulties.Contains(15) && (encounterItem.DifficultyMask & 48) > 0)
                                );
                                if (!forThis)
                                {
                                    // ToolContext.Logger.Warning("Difficulty skip? {instanceId} {instanceName} / {encounterId} {encounterName} / {mask} {diffs}",
                                    //     instance.ID,
                                    //     instance.Name,
                                    //     encounter.ID,
                                    //     encounter.Name,
                                    //     encounterItem.DifficultyMask,
                                    //     string.Join(',', difficulties));
                                    continue;
                                }
                            }

                            difficulties = difficulties
                                .OrderBy(d => Array.IndexOf(_difficultyOrder, d))
                                .ToArray();

                            var itemAppearances = new Dictionary<(int, int), OutJournalEncounterItemAppearance>();
                            foreach (var difficultyId in difficulties)
                            {
                                if (!(
                                        instanceData.BonusIds != null &&
                                        instanceData.BonusIds.TryGetValue(difficultyId, out int bonusId) &&
                                        bonusAppearanceModifiers.TryGetValue(bonusId, out int modifierId) &&
                                        appearances.TryGetValue((short)modifierId, out int appearanceId)
                                    ))
                                {
                                    var first = appearances
                                        .MinBy(kvp => kvp.Key);

                                    modifierId = first.Key;
                                    appearanceId = first.Value;
                                }

                                var appearanceKey = (appearanceId, modifierId);
                                if (!itemAppearances.ContainsKey(appearanceKey))
                                {
                                    itemAppearances[appearanceKey] = new OutJournalEncounterItemAppearance
                                    {
                                        AppearanceId = appearanceId,
                                        ModifierId = modifierId,
                                    };
                                }
                                itemAppearances[appearanceKey].Difficulties.Add(difficultyId);
                            }

                            var group = GetGroup(itemGroups, item, encounterItem.ID > 3_000_000);
                            group.Items.Add(new OutJournalEncounterItem
                            {
                                Id = encounterItem.ItemID,
                                ClassMask = item.GetCalculatedClassMask(legacyLoot),
                                ClassId = item.ClassId,
                                SubclassId = item.SubclassId,
                                Quality = item.Quality,
                                Type = RewardType.Item,
                                Appearances = itemAppearances
                                    .Values
                                    .OrderBy(app => app.Difficulties
                                        .Select(diff => Array.IndexOf(_difficultyOrder, diff))
                                        .Min()
                                    )
                                    .ToList(),
                            });
                        }

                        encounterData.Groups = itemGroups.Values
                            .OrderBy(group => group.Order)
                            .ToList();

                        foreach (var group in encounterData.Groups)
                        {
                            foreach (var item in group.Items)
                            {
                                foreach (var appearance in item.Appearances)
                                {
                                    // Don't use both Mythic and Mythic Keystone difficulties
                                    if (appearance.Difficulties.Contains(8) &&
                                        appearance.Difficulties.Contains(23))
                                    {
                                        appearance.Difficulties.Remove(8);
                                    }

                                    // Legacy raids like to have dungeon difficulties for some reason
                                    if (appearance.Difficulties.Contains(3) ||
                                        appearance.Difficulties.Contains(4) ||
                                        appearance.Difficulties.Contains(5) ||
                                        appearance.Difficulties.Contains(6))
                                    {
                                        appearance.Difficulties.Remove(1);
                                        appearance.Difficulties.Remove(2);
                                    }

                                    // Normalize 10N/25N/N to N and 10H/25H/H to H
                                    if (appearance.Difficulties.SequenceEqual(_raidNormals))
                                    {
                                        appearance.Difficulties = [14];
                                    } else if (appearance.Difficulties.SequenceEqual(_raidHeroics))
                                    {
                                        appearance.Difficulties = [15];
                                    }
                                }
                            }

                            group.Items = group.Items
                                .OrderBy(item =>
                                {
                                    // Armor
                                    if (_itemMap[item.Id].ClassId == 4)
                                    {
                                        return Array.IndexOf(Hardcoded.InventoryTypeOrder, _itemMap[item.Id].InventoryType);
                                    }
                                    // Weapon
                                    else if (_itemMap[item.Id].ClassId == 2)
                                    {
                                        return _itemMap[item.Id].SubclassId;
                                    }
                                    else
                                    {
                                        return 1000;
                                    }
                                })
                                .ThenBy(item => GetString(StringType.WowItemName, language, item.Id).ToLowerInvariant())
                                .ThenBy(item =>
                                    item.Appearances
                                        .SelectMany(app => app
                                            .Difficulties
                                            .Select(diff => Array.IndexOf(_difficultyOrder, diff))
                                        )
                                        .Min()
                                )
                                .ToList();
                        }

                        instanceData.EncountersRaw.Add(encounterData);
                    }

                    tierData.Instances.Add(instanceData);
                }

                if (tierData.Id == 1)
                {
                    cacheData.Tiers.Add(null);
                }

                cacheData.Tiers.Add(tierData);
            }

            var cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await db.SetCacheDataAndHash($"journal-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Generate", true);

        ToolContext.Logger.Information("{Timers}", _timer.ToString());
    }

    private string GetEncounterName(int encounterId, Language language)
    {
        return encounterId switch
        {
            > 4_000_000 and < 5_000_000 => "Vendors",
            > 3_000_000 and < 4_000_000 => "Convertible",
            > 2_000_000 and < 3_000_000 => "Shared Drops",
            > 1_000_000 and < 2_000_000 => "Trash Drops",
            _ => GetString(StringType.WowJournalEncounterName, language, encounterId)
        };
    }

    private static Dictionary<int, DataInstance> LoadInstances()
    {
        var di = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "instances"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var prefixLength = di.FullName.Length + 1;

        var ret = new Dictionary<int, DataInstance>();

        foreach (var file in files)
        {
            ToolContext.Logger.Information("📄{filename}", file.FullName.Substring(prefixLength));
            var instance = DataUtilities.YamlDeserializer.Deserialize<DataInstance>(File.OpenText(file.FullName));
            ret.Add(instance.InstanceId, instance);
        }

        return ret;
    }

    private string GetString(StringType type, Language language, int id)
    {
        if (!_stringMap.TryGetValue((type, language, id), out var languageName))
        {
            if (language != Language.enUS)
            {
                _stringMap.TryGetValue((type, Language.enUS, id), out languageName);
            }

            if (string.IsNullOrEmpty(languageName))
            {
                languageName = _stringMap.GetValueOrDefault(
                    (type, language, id), $"{type.ToString()} #{id}");
            }
        }

        return languageName;
    }

    private OutJournalEncounterItemGroup GetGroup(Dictionary<string, OutJournalEncounterItemGroup> groups, WowItem item, bool useMask)
    {
        string groupName = "Unknown";
        int groupOrder = 100;

        var cls = (GameItemClass)item.ClassId;
        if (cls == GameItemClass.Weapon)
        {
            var subClass = (WowWeaponSubclass)item.SubclassId;

            var member = subClass.GetType().GetMember(subClass.ToString())[0];
            groupName = member.GetCustomAttribute<DisplayAttribute>()?.Name ?? subClass.ToString();
            groupOrder = Hardcoded.WeaponSubClassOrder.GetValueOrDefault(item.SubclassId, 99);
        }
        else if (cls == GameItemClass.Armor)
        {
            var subClass = (WowArmorSubclass)item.SubclassId;
            if (useMask && item.ClassMask > 0 && BitOperations.PopCount((uint)item.ClassMask) == 1)
            {
                groupName = $":classMask-{item.ClassMask}:";
                groupOrder = Array.IndexOf(_classMaskOrder, item.ClassMask);
            }
            else if (subClass == WowArmorSubclass.Cloth)
            {
                groupName = "Cloth";
                groupOrder = 10;
            }
            else if (subClass == WowArmorSubclass.Leather)
            {
                groupName = "Leather";
                groupOrder = 11;
            }
            else if (subClass == WowArmorSubclass.Mail)
            {
                groupName = "Mail";
                groupOrder = 12;
            }
            else if (subClass == WowArmorSubclass.Plate)
            {
                groupName = "Plate";
                groupOrder = 13;
            }
            else if (subClass == WowArmorSubclass.Cloak)
            {
                groupName = "Cloak";
                groupOrder = 14;
            }
            else
            {
                groupName = "Misc";
                groupOrder = 15;
            }
        }

        if (!groups.TryGetValue(groupName, out var group))
        {
            groups[groupName] = group = new OutJournalEncounterItemGroup
            {
                Name = groupName,
                Order = groupOrder,
            };
        }

        return group;
    }

    private void AddGroupSpecial(
        Dictionary<string, OutJournalEncounterItemGroup> itemGroups,
        RewardType rewardType,
        WowItem item, int[] difficulties,
        int appearanceId = 0
    )
    {
        string name = "???";
        int order = -1;
        switch (rewardType)
        {
            case RewardType.Illusion:
                name = "Illusion";
                order = 0;
                break;

            case RewardType.Mount:
                name = "Mount";
                order = 1;
                break;

            case RewardType.Pet:
                name = "Pet";
                order = 2;
                break;

            case RewardType.Toy:
                name = "Toy";
                order = 3;
                break;

            case RewardType.Decor:
            case RewardType.Quest:
            case RewardType.Spell:
            case RewardType.Transmog:
                name = "Misc";
                order = 4;
                break;

            case RewardType.Recipe:
                name = "Recipe";
                order = 5;
                break;
        }

        if (!itemGroups.ContainsKey(name))
        {
            itemGroups[name] = new OutJournalEncounterItemGroup
            {
                Name = name,
                Order = order,
            };
        }

        int classId = 0;
        if (rewardType == RewardType.Mount)
        {
            classId = _mountMap[item.Id].Id;
        }
        else if (rewardType == RewardType.Pet)
        {
            classId = _petMap[item.Id].Id;
        }

        var outItem = new OutJournalEncounterItem
        {
            Id = item.Id,
            ClassId = classId,
            ClassMask = item.GetCalculatedClassMask(true),
            Quality = item.Quality,
            Type = rewardType,
            Appearances = new List<OutJournalEncounterItemAppearance>
            {
                new OutJournalEncounterItemAppearance
                {
                    AppearanceId = appearanceId,
                    ModifierId = 0,
                    Difficulties = difficulties.ToList(),
                }
            },
        };

        itemGroups[name].Items.Add(outItem);
    }
}
