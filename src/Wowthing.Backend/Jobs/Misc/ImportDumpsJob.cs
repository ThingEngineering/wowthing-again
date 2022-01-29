using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Enums;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Items;
using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc
{
    public class ImportDumpsJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;

        private Language[] _languages =
        {
            Language.deDE,
            Language.esES,
            Language.esMX,
            Language.frFR,
            Language.itIT,
            //Language.koKR,
            Language.ptBR,
            Language.ruRU,
            //Language.zhCN,
            //Language.zhTW,
        };

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.ImportDumps,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 9,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();
            
            await ImportItems();
            await ImportItemAppearances();
            await ImportMounts();
            await ImportPets();
            await ImportToys();

            await ImportStrings<DumpCreature>(
                StringType.WowCreatureName,
                "creature",
                (creature) => creature.ID,
                (creature) => creature.Name
            );
            
            await ImportStrings<DumpJournalEncounter>(
                StringType.WowJournalEncounterName,
                "journalencounter",
                (encounter) => encounter.ID,
                (encounter) => encounter.Name
            );
            
            await ImportStrings<DumpJournalInstance>(
                StringType.WowJournalInstanceName,
                "journalinstance",
                (instance) => instance.ID,
                (instance) => instance.Name
            );

            await ImportStrings<DumpJournalTier>(
                StringType.WowJournalTierName,
                "journaltier",
                (tier) => tier.ID,
                (tier) => tier.Name
            );

            await ImportStrings<DumpSkillLine>(
                StringType.WowSkillLineName,
                "skillline",
                (line) => line.ID,
                (line) => $"{line.DisplayName}|{line.HordeDisplayName}"
            );

            await ImportStrings<DumpSoulbind>(
                StringType.WowSoulbindName,
                "soulbind",
                (soulbind) => soulbind.ID,
                (soulbind) => soulbind.Name
            );

            await Context.SaveChangesAsync();
            _timer.AddPoint("Save", true);
            
            Logger.Information("{Timing}", _timer.ToString());
        }

        private async Task ImportStrings<TDump>(StringType type, string dumpName, Func<TDump, int> getIdFunc, Func<TDump, string> getStringFunc)
        {
            var dbLanguageMap = await Context.LanguageString
                .Where(ls => ls.Type == type)
                .AsNoTracking()
                .ToDictionaryAsync(ls => (ls.Language, ls.Id));
            
            foreach (var language in new[]{ Language.enUS }.Concat(_languages))
            {
                var dumpObjects = await DataUtilities.LoadDumpCsvAsync<TDump>(Path.Join(language.ToString(), dumpName), skipValidation: true);
                foreach (var dumpObject in dumpObjects)
                {
                    int objectId = getIdFunc(dumpObject);
                    string objectString = getStringFunc(dumpObject);
                    
                    if (!dbLanguageMap.TryGetValue((language, objectId), out var languageString))
                    {
                        languageString = new LanguageString
                        {
                            Language = language,
                            Type = type,
                            Id = objectId,
                            String = objectString,
                        };
                        Context.LanguageString.Add(languageString);
                    }
                    else if (objectString != languageString.String)
                    {
                        Context.LanguageString.Attach(languageString);
                        languageString.String = objectString;
                    }
                }
            }
            
            _timer.AddPoint(type.ToString());
        }
        
        private async Task ImportItems()
        {
            var items = await DataUtilities.LoadDumpCsvAsync<DumpItem>("item");
            
            var baseItemSparseMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>(Path.Join("enUS", "itemsparse")))
                .ToDictionary(itemsparse => itemsparse.ID);

            var dbItemMap = await Context.WowItem.ToDictionaryAsync(item => item.Id);
            
            var dbLanguageMap = await Context.LanguageString
                .Where(ls => ls.Type == StringType.WowItemName)
                .AsNoTracking()
                .ToDictionaryAsync(ls => (ls.Language, ls.Id));

            foreach (var item in items)
            {
                if (!baseItemSparseMap.TryGetValue(item.ID, out var itemSparse))
                {
                    //Logger.Debug("Item with no matching ItemSparse: {Id}", item.ID);
                    continue;
                }

                if (!dbItemMap.TryGetValue(item.ID, out var dbItem))
                {
                    dbItem = new WowItem
                    {
                        Id = item.ID,
                    };
                    Context.WowItem.Add(dbItem);
                }

                dbItem.ContainerSlots = itemSparse.ContainerSlots;
                dbItem.Quality = (WowQuality)itemSparse.OverallQualityID;
                dbItem.RaceMask = itemSparse.AllowableRace;
                dbItem.Stackable = itemSparse.Stackable;
                
                // Flags
                if (itemSparse.ItemNameDescriptionID == 13805 || // Cosmetic
                    itemSparse.Flags4.HasFlag(WowItemFlags4.Cosmetic))
                {
                    dbItem.Flags |= WowItemFlags.Cosmetic;
                }

                // Stats are ~fun~
                var primaryStats = new HashSet<WowStat>(itemSparse.Stats
                    .Where(stat => Hardcoded.PrimaryStats.ContainsKey(stat))
                    .SelectMany(stat => Hardcoded.PrimaryStats[stat])
                );
                if (primaryStats.Contains(WowStat.Agility) &&
                    primaryStats.Contains(WowStat.Intellect) &&
                    primaryStats.Contains(WowStat.Strength))
                {
                    dbItem.PrimaryStat = WowStat.AgilityIntellectStrength;
                }
                else if (primaryStats.Contains(WowStat.Agility) &&
                         primaryStats.Contains(WowStat.Intellect))
                {
                    dbItem.PrimaryStat = WowStat.AgilityIntellect;
                }
                else if (primaryStats.Contains(WowStat.Agility) &&
                         primaryStats.Contains(WowStat.Strength))
                {
                    dbItem.PrimaryStat = WowStat.AgilityStrength;
                }
                else if (primaryStats.Contains(WowStat.Intellect) &&
                         primaryStats.Contains(WowStat.Strength))
                {
                    dbItem.PrimaryStat = WowStat.IntellectStrength;
                }
                else if (primaryStats.Contains(WowStat.Agility))
                {
                    dbItem.PrimaryStat = WowStat.Agility;
                }
                else if (primaryStats.Contains(WowStat.Intellect))
                {
                    dbItem.PrimaryStat = WowStat.Intellect;
                }
                else if (primaryStats.Contains(WowStat.Strength))
                {
                    dbItem.PrimaryStat = WowStat.Strength;
                }
                
                // Class/Subclass might need to be mangled
                dbItem.ClassId = item.ClassID;
                dbItem.SubclassId = item.SubclassID;
                dbItem.InventoryType = item.InventoryType;

                if (Backend.Data.Hardcoded.ItemClassOverride.TryGetValue(item.ID, out var classTuple))
                {
                    dbItem.ClassId = (short)classTuple.Item1;
                    dbItem.SubclassId = (short)classTuple.Item2;
                }
                else if (dbItem.ClassId == (int)WowItemClass.Armor)
                {
                    var subClass = (WowArmorSubclass)dbItem.SubclassId;
                    // Cosmetic
                    /*if (dbItem.Flags.HasFlag(WowItemFlags.Cosmetic))
                    {
                        dbItem.SubclassId = (int)WowArmorSubclass.Cosmetic;
                    }*/
                    // Cloak
                    if (subClass == WowArmorSubclass.Cloth &&
                        dbItem.InventoryType == WowInventoryType.Back)
                    {
                        dbItem.SubclassId = (int)WowArmorSubclass.Cloak;
                    }
                    // Shield
                    else if (subClass == WowArmorSubclass.Shield)
                    {
                        dbItem.ClassId = (int)WowItemClass.Weapon;
                        dbItem.SubclassId = (int)WowWeaponSubclass.Shield;
                    }
                    // Off-hand
                    else if (subClass == WowArmorSubclass.Miscellaneous &&
                             dbItem.InventoryType == WowInventoryType.OffHand)
                    {
                        dbItem.ClassId = (int)WowItemClass.Weapon;
                        dbItem.SubclassId = (int)WowWeaponSubclass.OffHand;
                    }
                }

                dbItem.ClassMask = itemSparse.AllowableClass;
                /*if (dbItem.ClassMask <= 0)
                {
                    dbItem.ClassMask = dbItem.GetCalculatedClassMask();
                }*/
                
                // Strings
                if (!dbLanguageMap.TryGetValue((Language.enUS, item.ID), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = Language.enUS,
                        Type = StringType.WowItemName,
                        Id = item.ID,
                        String = itemSparse.Name,
                    };
                    Context.LanguageString.Add(languageString);
                }
                else if (itemSparse.Name != languageString.String)
                {
                    Context.LanguageString.Attach(languageString);
                    languageString.String = itemSparse.Name;
                }
            }

            foreach (var language in _languages)
            {
                var languageItemSparses = await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>(Path.Join(language.ToString(), "itemsparse"), skipValidation: true);
                foreach (var itemSparse in languageItemSparses)
                {
                    if (!dbLanguageMap.TryGetValue((language, itemSparse.ID), out var languageString))
                    {
                        languageString = new LanguageString
                        {
                            Language = language,
                            Type = StringType.WowItemName,
                            Id = itemSparse.ID,
                            String = itemSparse.Name,
                        };
                        Context.LanguageString.Add(languageString);
                    }
                    else if (itemSparse.Name != languageString.String)
                    {
                        Context.LanguageString.Attach(languageString);
                        languageString.String = itemSparse.Name;
                    }
                }
            }
            
            _timer.AddPoint("Items");
        }

        private async Task ImportItemAppearances()
        {
            var itemModifiedAppearances = await DataUtilities.LoadDumpCsvAsync<DumpItemModifiedAppearance>("itemmodifiedappearance");
            var dbMap = await Context.WowItemModifiedAppearance
                .ToDictionaryAsync(wima => wima.Id);

            foreach (var ima in itemModifiedAppearances)
            {
                if (!dbMap.TryGetValue(ima.ID, out var dbAppearance))
                {
                    dbAppearance = new WowItemModifiedAppearance
                    {
                        Id = ima.ID,
                    };
                    Context.WowItemModifiedAppearance.Add(dbAppearance);
                }
                
                dbAppearance.AppearanceId = ima.ItemAppearanceID;
                dbAppearance.ItemId = ima.ItemID;
                dbAppearance.Modifier = ima.ItemAppearanceModifierID;
                
                // HACK fix Warglaives of Azzinoth appearance IDs
                if ((ima.ItemID == 32837 || ima.ItemID == 32838) && ima.ItemAppearanceModifierID == 0)
                {
                    dbAppearance.AppearanceId = 34777;
                }
            }
        }
        
        private async Task ImportMounts()
        {
            var baseMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>(Path.Join("enUS", "mount"));

            var dbMountMap = await Context.WowMount
                .ToDictionaryAsync(mount => mount.Id);

            var itemEffectsMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemXItemEffect>("itemxitemeffect"))
                .ToGroupedDictionary(ixie => ixie.ItemEffectID);

            var mountSpellIds = baseMounts.Select(mount => mount.SourceSpellID);
            var spellTeachMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemEffect>("itemeffect"))
                .Where(ie => mountSpellIds.Contains(ie.SpellID) && ie.TriggerType == 6) // Learn
                .GroupBy(ie => ie.SpellID)
                .ToDictionary(
                    group => group.Key,
                    group => group.First());

            var dbLanguageMap = await Context.LanguageString
                .Where(ls => ls.Type == StringType.WowMountName)
                .AsNoTracking()
                .ToDictionaryAsync(ls => (ls.Language, ls.Id));

            foreach (var mount in baseMounts)
            {
                if (!dbMountMap.TryGetValue(mount.ID, out var dbMount))
                {
                    dbMount = new WowMount
                    {
                        Id = mount.ID,
                    };
                    Context.WowMount.Add(dbMount);
                }

                dbMount.SpellId = mount.SourceSpellID;
                dbMount.Flags = mount.Flags;
                dbMount.SourceType = mount.SourceTypeEnum;

                if (spellTeachMap.TryGetValue(dbMount.SpellId, out var itemEffect) &&
                    itemEffectsMap.TryGetValue(itemEffect.ID, out var xItemEffects))
                {
                    dbMount.ItemId = xItemEffects.First().ItemID;
                }
                
                if (!dbLanguageMap.TryGetValue((Language.enUS, mount.ID), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = Language.enUS,
                        Type = StringType.WowMountName,
                        Id = mount.ID,
                        String = mount.Name,
                    };
                    Context.LanguageString.Add(languageString);
                }
                else if (mount.Name != languageString.String)
                {
                    Context.LanguageString.Attach(languageString);
                    languageString.String = mount.Name;
                }
            }

            foreach (var language in _languages)
            {
                var languageMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>(Path.Join(language.ToString(), "mount"), skipValidation: true);
                foreach (var mount in languageMounts)
                {
                    if (!dbLanguageMap.TryGetValue((language, mount.ID), out var languageString))
                    {
                        languageString = new LanguageString
                        {
                            Language = language,
                            Type = StringType.WowMountName,
                            Id = mount.ID,
                            String = mount.Name,
                        };
                        Context.LanguageString.Add(languageString);
                    }
                    else if (mount.Name != languageString.String)
                    {
                        Context.LanguageString.Attach(languageString);
                        languageString.String = mount.Name;
                    }
                }
            }

            _timer.AddPoint("Mounts");
        }

        private async Task ImportPets()
        {
            var pets = await DataUtilities.LoadDumpCsvAsync<DumpBattlePetSpecies>("battlepetspecies");

            var dbPetMap = await Context.WowPet
                .ToDictionaryAsync(pet => pet.Id);

            foreach (var pet in pets)
            {
                if (!dbPetMap.TryGetValue(pet.ID, out var dbPet))
                {
                    dbPet = new WowPet
                    {
                        Id = pet.ID,
                    };
                    Context.WowPet.Add(dbPet);
                }

                dbPet.CreatureId = pet.CreatureID;
                dbPet.SpellId = pet.SummonSpellID;
                dbPet.Flags = pet.Flags;
                dbPet.PetType = pet.PetTypeEnum;
                dbPet.SourceType = pet.SourceTypeEnum;
            }
            
            _timer.AddPoint("Pets");
        }

        private async Task ImportToys()
        {
            var toys = await DataUtilities.LoadDumpCsvAsync<DumpToy>("toy");

            var dbToyMap = await Context.WowToy
                .ToDictionaryAsync(toy => toy.Id);

            foreach (var toy in toys)
            {
                if (!dbToyMap.TryGetValue(toy.ID, out var dbToy))
                {
                    dbToy = new WowToy
                    {
                        Id = toy.ID,
                    };
                    Context.WowToy.Add(dbToy);
                }

                dbToy.ItemId = toy.ItemID;
                dbToy.Flags = toy.Flags;
                dbToy.SourceType = toy.SourceTypeEnum;
            }
            
            _timer.AddPoint("Toys");
        }
    }
}
