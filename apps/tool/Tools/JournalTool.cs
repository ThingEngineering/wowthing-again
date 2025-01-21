using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Serilog.Context;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models;
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
    private Dictionary<(StringType Type, Language language, int Id), string> _stringMap;
    private HashSet<int> _recipeItemIds;

    private readonly int[] _difficultyOrder =
    {
        1, // Dungeon Normal
        2, // Dungeon Heroic
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
                    .Where(group2 => group2.MaybePlayerConditionID is 0 or 125989)
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

        // { itemId => { modifierId => appearanceId } }
        var appearancesByItemId = (await context.WowItemModifiedAppearance.ToArrayAsync())
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

        _mountMap = await context.WowMount
            .AsNoTracking()
            .Where(mount => mount.ItemId > 0)
            .ToDictionaryAsync(mount => mount.ItemId);

        _petMap = await context.WowPet
            .AsNoTracking()
            .Where(pet => pet.ItemId > 0 && (pet.Flags & 32) == 0)
            .ToDictionaryAsync(pet => pet.ItemId);

        _toyMap = await context.WowToy
            .AsNoTracking()
            .ToDictionaryAsync(toy => toy.ItemId);

        _stringMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => _stringTypes.Contains(ls.Type))
            .ToDictionaryAsync(ls => (ls.Type, ls.Language, ls.Id), ls => ls.String);

        var recipeItemIds = await context.WowProfessionRecipeItem
            .AsNoTracking()
            .Select(wpri => wpri.ItemId)
            .Distinct()
            .ToArrayAsync();
        _recipeItemIds = new HashSet<int>(recipeItemIds);

        _timer.AddPoint("Database");

        var itemExpansions = DataUtilities.LoadItemExpansions();

        _timer.AddPoint("Shared");

        foreach (var (tier, dungeons) in Hardcoded.ExtraTiers)
        {
            tiers.Add(tier);
            tierToInstances[tier.ID] = dungeons
                .Select(dungeon => dungeon.ID)
                .ToArray();

            foreach (var language in Enum.GetValues<Language>())
            {
                _stringMap[(StringType.WowJournalTierName, language, tier.ID)] = tier.Name;
            }

            foreach (var dungeon in dungeons)
            {
                instancesById[dungeon.ID] = dungeon;
                encountersByInstanceId[dungeon.ID] = new List<DumpJournalEncounter>();

                foreach (var language in Enum.GetValues<Language>())
                {
                    _stringMap[(StringType.WowJournalInstanceName, language, dungeon.ID)] = dungeon.Name;
                }
            }
        }

        // Once per language, oh boy
        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
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
                    var instance = instancesById[instanceId];
                    var map = mapsById[instance.MapID];
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
                    if (Hardcoded.JournalBossOrder.TryGetValue(instanceId, out var bossOrder))
                    {
                        encounters = encounters
                            .OrderBy(encounter => Array.IndexOf(bossOrder, encounter.ID))
                            .ToList();
                    }

                    // Instance has extra encounters, add those
                    if (Hardcoded.ExtraEncounters.TryGetValue(instanceId, out var extraEncounters))
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

                            _stringMap[(StringType.WowJournalEncounterName, language, encounterId)] = extraEncounter.Name;
                        }
                    }

                    // Instance has shared drops, add a fake encounter
                    if (Hardcoded.ExtraItemDrops.ContainsKey(2000000 + instanceId))
                    {
                        encountersByInstanceId[instanceId].Insert(0, new DumpJournalEncounter
                        {
                            ID = 2000000 + instanceId,
                            OrderIndex = -9,
                        });
                    }

                    // Instance has trash drops, add a fake encounter
                    if (Hardcoded.ExtraItemDrops.ContainsKey(1000000 + instanceId))
                    {
                        encountersByInstanceId[instanceId].Insert(0, new DumpJournalEncounter
                        {
                            ID = 1000000 + instanceId,
                            OrderIndex = -10,
                        });
                    }

                    foreach (var encounter in encounters)
                    {
                        if (Hardcoded.IgnoredJournalEncounter.Contains(encounter.ID))
                        {
                            continue;
                        }

                        if (Hardcoded.JournalEncounterDifficulties.TryGetValue(encounter.ID,
                                out int[] encounterDifficulties))
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
                            Statistics = statistics,
                        };

                        var items = new List<DumpJournalEncounterItem>();

                        if (encounter.ID > 2000000)
                        {
                            encounterData.Name = "Shared Drops";
                        }
                        else if (encounter.ID > 1000000)
                        {
                            encounterData.Name = "Trash Drops";
                        }
                        else
                        {
                            encounterData.Name = GetString(StringType.WowJournalEncounterName, language, encounter.ID);

                            var fakeItems = new Dictionary<int, DumpJournalEncounterItem>();
                            foreach (var encounterItem in itemsByEncounterId.GetValueOrDefault(encounter.ID, []))
                            {
                                if (itemExpansions.TryGetValue(encounterItem.ItemID, out var expandedItems))
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

                            items.AddRange(fakeItems.Values);
                        } // if (encounter.ID > 1000000)

                        if (Hardcoded.ExtraItemDrops.TryGetValue(encounter.ID, out var extraItems))
                        {
                            //Logger.Debug("Adding extra items for encounter {Id}", encounter.ID);
                            foreach (var extraItem in extraItems)
                            {
                                difficultiesByEncounterItemId[1000000 + extraItem.ItemId] = extraItem.Difficulties.ToArray();
                                items.Add(new DumpJournalEncounterItem
                                {
                                    ID = 1000000 + extraItem.ItemId,
                                    DifficultyMask = 0,
                                    FactionMask = 0,
                                    Flags = 0,
                                    ItemID = extraItem.ItemId,
                                    JournalEncounterID = encounter.ID,
                                });
                            }
                        }

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

                            if (item.InventoryType is WowInventoryType.Finger or WowInventoryType.Neck)
                            {
                                continue;
                            }

                            bool difficultiesOverridden = false;
                            if (!hadDifficulties)
                            {
                                if (tier.ID == 505 &&
                                    encounterItem.Field_11_0_2_55959_007 is 0 or 44658 or 44659 &&
                                    difficultiesByEncounterItemId.TryGetValue(encounterItem.ID, out difficulties))
                                {
                                    if (encounterItem.Field_11_0_2_55959_007 == 44658)
                                    {
                                        // WorldStateExpression - aj?(574, 0) == 1 && aj?(576) == 0
                                        // HACK: treat this as heroic only, idk
                                        difficulties = difficulties.Where(difficulty => difficulty == 8).ToArray();
                                    }
                                    else
                                    {
                                        continue;
                                        // // WorldStateExpression - aj?(574, 0) != 1 && aj?(576) == 1
                                        // // HACK: treat this as mythic only, idk
                                        // ToolContext.Logger.Warning("44659 {hm}", string.Join(',', difficulties));
                                        // difficulties = difficulties.Where(difficulty => difficulty == 2).ToArray();
                                    }

                                    if (difficulties.Length == 0)
                                    {
                                        ToolContext.Logger.Warning("No valid HACK difficulties for item ID {Id}", encounterItem.ID);
                                        continue;
                                    }
                                }
                                else if (encounterItem.DifficultyMask == -1)
                                {
                                    difficulties = mapDifficulties;
                                }
                                else if (difficultiesByEncounterItemId.TryGetValue(encounterItem.ID, out difficulties))
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
                                        difficulties = difficulties
                                            .Where(difficulty => difficulty == 8)
                                            .ToArray();
                                        if (difficulties.Length == 0)
                                        {
                                            continue;
                                        }
                                    }

                                    if (difficulties.Length == 0)
                                    {
                                        // ToolContext.Logger.Warning("No valid difficulties for item ID {Id}", encounterItem.ID);
                                        continue;
                                    }
                                }
                                else {
                                    ToolContext.Logger.Warning("No difficulties for item ID {Id}", encounterItem.ID);
                                    continue;
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

                            var itemAppearances = new Dictionary<int, OutJournalEncounterItemAppearance>();
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

                                if (!itemAppearances.ContainsKey(appearanceId))
                                {
                                    itemAppearances[appearanceId] = new OutJournalEncounterItemAppearance
                                    {
                                        AppearanceId = appearanceId,
                                        ModifierId = modifierId,
                                    };
                                }
                                itemAppearances[appearanceId].Difficulties.Add(difficultyId);
                            }

                            var group = GetGroup(itemGroups, item);
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

    private OutJournalEncounterItemGroup GetGroup(Dictionary<string, OutJournalEncounterItemGroup> groups, WowItem item)
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
            if (subClass == WowArmorSubclass.Cloth)
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

            case RewardType.Recipe:
                name = "Recipe";
                order = 4;
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
