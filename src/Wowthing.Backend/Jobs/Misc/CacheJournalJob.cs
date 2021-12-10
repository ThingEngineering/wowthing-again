using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Data;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheJournalJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheJournal,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 8,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();
            
            await BuildJournalData();
            
            Logger.Information("{Timers}", _timer.ToString());
        }

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
        
        private async Task BuildJournalData()
        {
            // TODO languages
            var tiers = await DataUtilities.LoadDumpCsvAsync<DumpJournalTier>(Path.Join("enUS", "journaltier"));
            var instancesById = (await DataUtilities.LoadDumpCsvAsync<DumpJournalInstance>(Path.Join("enUS", "journalinstance")))
                .ToDictionary(instance => instance.ID);
            var encountersByInstanceId = (await DataUtilities.LoadDumpCsvAsync<DumpJournalEncounter>(Path.Join("enUS", "journalencounter")))
                .GroupBy(encounter => encounter.JournalInstanceID)
                .ToDictionary(
                    group => group.Key,
                    group => group.OrderBy(encounter => encounter.OrderIndex)
                );

            var tierToInstance = (await DataUtilities.LoadDumpCsvAsync<DumpJournalTierXInstance>("journaltierxinstance"))
                .GroupBy(x => x.JournalTierID)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .Select(x => x.JournalInstanceID)
                        .ToArray()
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
            var appearancesByItemId = (await DataUtilities.LoadDumpCsvAsync<DumpItemModifiedAppearance>("itemmodifiedappearance"))
                .GroupBy(ima => ima.ItemID)
                .ToDictionary(
                    group => group.Key,
                    group => group.ToDictionary(
                        group2 => group2.ItemAppearanceModifierID,
                        group2 => group2.ItemAppearanceID
                    )
                );
            
            // HACK fix Warglaives of Azzinoth appearance IDs
            appearancesByItemId[32837][0] = 34777;
            appearancesByItemId[32838][0] = 34777;

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
            
            _timer.AddPoint("CSV");

            var itemMap = await Context.WowItem
                .AsNoTracking()
                .Where(item => 
                    item.ClassId == 2 ||
                    (item.ClassId == 4 && item.SubclassId != 0)
                )
                .ToDictionaryAsync(item => item.Id);

            // TODO languages
            var stringMap = await Context.LanguageString
                .Where(ls => ls.Type == StringType.WowItemName && ls.Language == Language.enUS)
                .AsNoTracking()
                .ToDictionaryAsync(ls => (ls.Language, ls.Id), ls => ls.String);
            
            _timer.AddPoint("Database");

            tiers.Reverse();
            var cacheData = new RedisJournalCache();
            foreach (var tier in tiers)
            {
                var tierData = new OutJournalTier
                {
                    Id = tier.ID,
                    Name = tier.Name,
                };

                var instances = tierToInstance[tier.ID]
                    .OrderBy(instanceId => instancesById[instanceId].OrderIndex)
                    .ToArray();
                foreach (var instanceId in instances)
                {
                    var instance = instancesById[instanceId];
                    var mapDifficulties = difficultiesByMapId[instance.MapID];
                    
                    var instanceData = new OutJournalInstance
                    {
                        Id = instance.ID,
                        Name = instance.Name,
                    };

                    if (Hardcoded.InstanceBonusIds.TryGetValue(instanceId, out var bonusIds))
                    {
                        instanceData.BonusIds = bonusIds;
                    }

                    foreach (var encounter in encountersByInstanceId[instanceId])
                    {
                        var encounterData = new OutJournalEncounter
                        {
                            Name = encounter.Name,
                        };

                        var items = new List<DumpJournalEncounterItem>();
                        var fakeItems = new Dictionary<int, DumpJournalEncounterItem>();
                        foreach (var encounterItem in itemsByEncounterId[encounter.ID])
                        {
                            if (Hardcoded.ItemExpansions.TryGetValue(encounterItem.ItemID, out var expandedItems))
                            {
                                Logger.Debug("Expanding items for {Id}", encounterItem.ItemID);
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
                            }
                            else
                            {
                                items.Add(encounterItem);
                            }
                        }
                        items.AddRange(fakeItems.Values);

                        if (Hardcoded.ExtraItemDrops.TryGetValue(encounter.ID, out var extraItems))
                        {
                            Logger.Debug("Adding extra items for encounter {Id}", encounter.ID);
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
                                Logger.Debug("Skipping ignored item {Id}", encounterItem.ItemID);
                                continue;
                            }
                            
                            if (!itemMap.TryGetValue(encounterItem.ItemID, out var item))
                            {
                                //Logger.Warning("No item for ID {Id}", encounterItem.ItemID);
                                continue;
                            }

                            if (!appearancesByItemId.TryGetValue(encounterItem.ItemID, out var appearances))
                            {
                                Logger.Debug("No appearances for ID {Id}", encounterItem.ItemID);
                                continue;
                            }

                            if (!Hardcoded.InstanceDifficulties.TryGetValue(instanceId, out int[] difficulties))
                            {
                                if (encounterItem.DifficultyMask == -1)
                                {
                                    difficulties = mapDifficulties;
                                }
                                else if (!difficultiesByEncounterItemId.TryGetValue(encounterItem.ID, out difficulties))
                                {
                                    Logger.Warning("No difficulties for item ID {Id}", encounterItem.ID);
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
                                    appearances.TryGetValue(modifierId, out int appearanceId)
                                ))
                                {
                                    var first = appearances
                                        .OrderBy(kvp => kvp.Key)
                                        .First();

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

                            foreach (var appearance in itemAppearances.Values)
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

                            short subclassId = item.InventoryType == (short)WowInventoryType.Back ? (short)0 : item.SubclassId;
                            
                            var group = GetGroup(itemGroups, item);
                            group.Items.Add(new OutJournalEncounterItem
                            {
                                Id = encounterItem.ItemID,
                                ClassMask = item.CalculatedClassMask,
                                ClassId = item.ClassId,
                                SubclassId = subclassId,
                                Quality = item.Quality,
                                Appearances = itemAppearances
                                    .Values
                                    .ToList(),
                            });
                        }

                        encounterData.Groups = itemGroups.Values
                            .OrderBy(group => group.Order)
                            .ToList();

                        foreach (var group in encounterData.Groups)
                        {
                            group.Items = group.Items
                                .OrderBy(item =>
                                {
                                    // Armor
                                    if (itemMap[item.Id].ClassId == 4)
                                    {
                                        if (itemMap[item.Id].SubclassId >= 1 && itemMap[item.Id].SubclassId <= 4)
                                        {
                                            return itemMap[item.Id].SubclassId;
                                        }
                                        else
                                        {
                                            return 5 + itemMap[item.Id].SubclassId;
                                        }
                                    }
                                    // Weapon
                                    else if (itemMap[item.Id].ClassId == 2)
                                    {
                                        return 100 + itemMap[item.Id].SubclassId;
                                    }
                                    else
                                    {
                                        return 1000000;
                                    }
                                })
                                .ThenBy(item => stringMap[(Language.enUS, item.Id)])
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

                        instanceData.Encounters.Add(encounterData);
                    }
                    
                    tierData.Instances.Add(instanceData);
                }
                
                cacheData.Tiers.Add(tierData);
            }
            
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            var db = Redis.GetDatabase();
            await db.SetCacheDataAndHash("journal", cacheJson, cacheHash);
            _timer.AddPoint("Cache", true);
        }

        private OutJournalEncounterItemGroup GetGroup(Dictionary<string, OutJournalEncounterItemGroup> groups, WowItem item)
        {
            string groupName = null;
            int groupOrder = 100;
            
            if (item.ClassId == 2)
            {
                groupName = "Weapons";
                groupOrder = 10;
            }
            else if (item.ClassId == 4)
            {
                if (item.SubclassId == 1)
                {
                    if (item.InventoryType == (short)WowInventoryType.Back)
                    {
                        groupName = "Cloaks";
                        groupOrder = 5;
                    }
                    else
                    {
                        groupName = "Cloth";
                        groupOrder = 1;
                    }
                }
                else if (item.SubclassId == 2)
                {
                    groupName = "Leather";
                    groupOrder = 2;
                }
                else if (item.SubclassId == 3)
                {
                    groupName = "Mail";
                    groupOrder = 3;
                }
                else if (item.SubclassId == 4)
                {
                    groupName = "Plate";
                    groupOrder = 4;
                }
                // Shields
                else if (item.SubclassId == 6)
                {
                    groupName = "Weapons";
                    groupOrder = 10;
                }
                else
                {
                    groupName = "Misc";
                    groupOrder = 9;
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
    }
}
