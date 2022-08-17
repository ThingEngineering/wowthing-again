using Wowthing.Backend.Enums;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Items;
using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class ImportDumpsJob : JobBase, IScheduledJob
{
    private JankTimer _timer;

    private readonly Language[] _languages =
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

    // Unsure if Blizzard data is broken or wow.tools
    private readonly Dictionary<int, int> _fixedPetSpell = new Dictionary<int, int>()
    {
        { 1150, 135261 }, // Ashstone Core
        { 1322, 148049 }, // Blackfuse Bombling
        { 1328, 148050 }, // Ruby Droplet
        { 1395, 159296 }, // Lil' Leftovers
        { 1511, 171118 }, // Lovebird Hatchling
        { 2584, 291547 }, // Spirit of the Spring
    };

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.ImportDumps,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 23,
    };

    private Dictionary<int, DumpItemXItemEffect[]> _itemEffectsMap;
    private Dictionary<int, int[]> _spellTeachMap;

    public override async Task Run(params string[] data)
    {
        _timer = new JankTimer();

        await ImportCharacterClasses();
        await ImportCharacterRaces();
        await ImportCharacterSpecializations();
        await ImportCurrencies();
        await ImportCurrencyCategories();
        await ImportFactions();
        await ImportInstances();

        await ImportItems();
        await ImportItemAppearances();

        await ImportItemEffects();

        await ImportMounts();
        await ImportPets();
        await ImportToys();

        await ImportStrings<DumpCreature>(
            StringType.WowCreatureName,
            "creature",
            creature => creature.ID,
            creature => creature.Name
        );

        await ImportStrings<DumpJournalEncounter>(
            StringType.WowJournalEncounterName,
            "journalencounter",
            encounter => encounter.ID,
            encounter => encounter.Name
        );

        await ImportStrings<DumpJournalInstance>(
            StringType.WowJournalInstanceName,
            "journalinstance",
            instance => instance.ID,
            instance => instance.Name
        );

        await ImportStrings<DumpJournalTier>(
            StringType.WowJournalTierName,
            "journaltier",
            tier => tier.ID,
            tier => tier.Name
        );

        await ImportStrings<DumpSkillLine>(
            StringType.WowSkillLineName,
            "skillline",
            line => line.ID,
            line => $"{line.DisplayName}|{line.HordeDisplayName}"
        );

        await ImportStrings<DumpSoulbind>(
            StringType.WowSoulbindName,
            "soulbind",
            soulbind => soulbind.ID,
            soulbind => soulbind.Name
        );

        await ImportStrings<DumpSpellItemEnchantment>(
            StringType.WowSpellItemEnchantmentName,
            "spellitemenchantment",
            ench => ench.ID,
            ench => ench.Name
        );

        await Context.SaveChangesAsync();
        _timer.AddPoint("Save", true);

        Logger.Information("{Timing}", _timer.ToString());
    }

    private async Task ImportStrings<TDump>(
        StringType type,
        string dumpName,
        Func<TDump, int> getIdFunc,
        Func<TDump, string> getStringFunc,
        Func<TDump, bool> filterFunc = null
    )
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
                if (filterFunc != null && !filterFunc(dumpObject))
                {
                    continue;
                }

                int objectId = getIdFunc(dumpObject);
                string objectString = getStringFunc(dumpObject);

                if (!dbLanguageMap.TryGetValue((language, objectId), out var languageString))
                {
                    languageString = dbLanguageMap[(language, objectId)] = new LanguageString
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

    private async Task ImportCharacterClasses()
    {
        var classes = await DataUtilities
            .LoadDumpCsvAsync<DumpChrClasses>(Path.Join("enUS", "chrclasses"));

        var dbClassMap = await Context.WowCharacterClass
            .ToDictionaryAsync(spec => spec.Id);

        foreach (var cls in classes)
        {
            if (!dbClassMap.TryGetValue(cls.ID, out var dbClass))
            {
                dbClass = new WowCharacterClass
                {
                    Id = cls.ID,
                };
                Context.WowCharacterClass.Add(dbClass);
            }

            dbClass.ArmorMask = cls.ArmorTypeMask;
            dbClass.RolesMask = cls.RolesMask;
            dbClass.Slug = cls.MaleName.Slugify();
        }

        _timer.AddPoint("CharacterClasses");

        await ImportStrings<DumpChrClasses>(
            StringType.WowCharacterClassName,
            "chrclasses",
            cls => cls.ID,
            cls => $"{cls.MaleName}|{cls.FemaleName}"
        );
    }

    private async Task ImportCharacterRaces()
    {
        var dumpRaces = await DataUtilities
            .LoadDumpCsvAsync<DumpChrRaces>(Path.Join("enUS", "chrraces"));

        var dbRaceMap = await Context.WowCharacterRace
            .ToDictionaryAsync(race => race.Id);

        foreach (var dumpRace in dumpRaces.Where(race => race.PlayableRaceBit >= 0))
        {
            if (!dbRaceMap.TryGetValue(dumpRace.ID, out var dbRace))
            {
                dbRace = new WowCharacterRace
                {
                    Id = dumpRace.ID,
                };
                Context.WowCharacterRace.Add(dbRace);
            }

            dbRace.Faction = dumpRace.Faction;
        }

        _timer.AddPoint("CharacterRaces");

        await ImportStrings<DumpChrRaces>(
            StringType.WowCharacterRaceName,
            "chrraces",
            race => race.ID,
            race => $"{race.Name}|{race.FemaleName}"
        );
    }

    private async Task ImportCharacterSpecializations()
    {
        var specs = await DataUtilities
            .LoadDumpCsvAsync<DumpChrSpecialization>(Path.Join("enUS", "chrspecialization"));

        var dbSpecMap = await Context.WowCharacterSpecialization
            .ToDictionaryAsync(spec => spec.Id);

        foreach (var spec in specs)
        {
            if (spec.ClassID == 0)
            {
                continue;
            }

            if (!dbSpecMap.TryGetValue(spec.ID, out var dbSpec))
            {
                dbSpec = new WowCharacterSpecialization
                {
                    Id = spec.ID,
                };
                Context.WowCharacterSpecialization.Add(dbSpec);
            }

            dbSpec.ClassId = spec.ClassID;
            dbSpec.Order = spec.OrderIndex;
            dbSpec.Role = spec.Role;

            if (spec.PrimaryStatPriority >= 4)
            {
                dbSpec.PrimaryStat = WowStat.Strength;
            }
            else if (spec.PrimaryStatPriority >= 2)
            {
                dbSpec.PrimaryStat = WowStat.Agility;
            }
            else
            {
                dbSpec.PrimaryStat = WowStat.Intellect;
            }
        }

        _timer.AddPoint("CharacterSpecializations");

        await ImportStrings<DumpChrSpecialization>(
            StringType.WowCharacterSpecializationName,
            "chrspecialization",
            spec => spec.ID,
            spec => $"{spec.Name}|{spec.FemaleName}"
        );
    }

    private async Task ImportCurrencies()
    {
        var currencies = await DataUtilities
            .LoadDumpCsvAsync<DumpCurrencyTypes>(Path.Join("enUS", "currencytypes"));

        var dbCurrencyMap = await Context.WowCurrency
            .ToDictionaryAsync(currency => currency.Id);

        foreach (var currency in currencies)
        {
            if (!dbCurrencyMap.TryGetValue(currency.ID, out var dbCurrency))
            {
                dbCurrency = dbCurrencyMap[currency.ID] = new WowCurrency
                {
                    Id = currency.ID,
                };
                Context.WowCurrency.Add(dbCurrency);
            }

            dbCurrency.CategoryId = currency.CategoryID;
            dbCurrency.MaxPerWeek = currency.MaxEarnablePerWeek;
            dbCurrency.MaxTotal = currency.MaxQty;
        }

        _timer.AddPoint("Currency");

        await ImportStrings<DumpCurrencyTypes>(
            StringType.WowCurrencyName,
            "currencytypes",
            currency => currency.ID,
            currency => currency.Name
        );
    }

    private async Task ImportCurrencyCategories()
    {
        var categories = await DataUtilities
            .LoadDumpCsvAsync<DumpCurrencyCategory>(Path.Join("enUS", "currencycategory"));

        var dbCategoryMap = await Context.WowCurrencyCategory
            .ToDictionaryAsync(currency => currency.Id);

        foreach (var category in categories)
        {
            if (!dbCategoryMap.TryGetValue(category.ID, out var dbCategory))
            {
                dbCategory = dbCategoryMap[category.ID] = new WowCurrencyCategory
                {
                    Id = category.ID,
                };
                Context.WowCurrencyCategory.Add(dbCategory);
            }

            dbCategory.Expansion = category.ExpansionID;
            dbCategory.Flags = category.Flags;
        }

        _timer.AddPoint("CurrencyCategory");

        await ImportStrings<DumpCurrencyCategory>(
            StringType.WowCurrencyCategoryName,
            "currencycategory",
            category => category.ID,
            category => category.Name
        );
    }

    private async Task ImportFactions()
    {
        var factions = await DataUtilities
            .LoadDumpCsvAsync<DumpFaction>(Path.Join("enUS", "faction"));

        var dbReputationMap = await Context.WowReputation
            .ToDictionaryAsync(rep => rep.Id);

        foreach (var faction in factions)
        {
            if (!dbReputationMap.TryGetValue(faction.ID, out var dbReputation))
            {
                dbReputation = dbReputationMap[faction.ID] = new WowReputation
                {
                    Id = faction.ID,
                };
                Context.WowReputation.Add(dbReputation);
            }

            dbReputation.Expansion = faction.Expansion;
            dbReputation.ParagonId = faction.ParagonFactionID;
            dbReputation.ParentId = faction.ParentFactionID;
            dbReputation.TierId = faction.FriendshipRepID;
        }

        _timer.AddPoint("Faction");

        await ImportStrings<DumpFaction>(
            StringType.WowReputationName,
            "faction",
            faction => faction.ID,
            faction => faction.Name
        );

        await ImportStrings<DumpFaction>(
            StringType.WowReputationDescription,
            "faction",
            faction => faction.ID,
            faction => faction.Description
        );
    }

    private async Task ImportInstances()
    {
        var instances = await DataUtilities
            .LoadDumpCsvAsync<DumpJournalInstance>(Path.Join("enUS", "journalinstance"));

        var mapIdToInstanceId = instances
            .Where(instance => !Hardcoded.SkipInstances.Contains(instance.ID))
            .ToDictionary(
                instance => instance.MapID,
                instance => instance.ID
            );

        _timer.AddPoint("Instances");

        await ImportStrings<DumpMap>(
            StringType.WowJournalInstanceMapName,
            "map",
            (map) => mapIdToInstanceId[map.ID],
            (map) => map.Name,
            (map) => mapIdToInstanceId.ContainsKey(map.ID)
        );
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
            dbItem.Expansion = itemSparse.ExpansionID;
            dbItem.ItemLevel = itemSparse.ItemLevel;
            dbItem.Quality = (WowQuality)itemSparse.OverallQualityID;
            dbItem.RaceMask = itemSparse.AllowableRace;
            dbItem.RequiredLevel = itemSparse.RequiredLevel;
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

            if (itemSparse.ItemLevel == 1 && dbItem.Flags.HasFlag(WowItemFlags.Cosmetic))
            {
                dbItem.PrimaryStat = WowStat.None;
            }
            else if (primaryStats.Contains(WowStat.Agility) &&
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
                         dbItem.InventoryType == WowInventoryType.HeldInOffHand)
                {
                    dbItem.ClassId = (int)WowItemClass.Weapon;
                    dbItem.SubclassId = (int)WowWeaponSubclass.OffHand;
                }
                // Tabard
                else if (subClass == WowArmorSubclass.Miscellaneous &&
                         dbItem.InventoryType == WowInventoryType.Tabard)
                {
                    dbItem.SubclassId = (int)WowArmorSubclass.Tabard;
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
            dbAppearance.Order = ima.OrderIndex;
            dbAppearance.SourceType = ima.TransmogSourceTypeEnum;

            // HACK fix Warglaives of Azzinoth appearance IDs
            if ((ima.ItemID == 32837 || ima.ItemID == 32838) && ima.ItemAppearanceModifierID == 0)
            {
                dbAppearance.AppearanceId = 34777;
            }
        }
    }

    private async Task ImportItemEffects()
    {
        var itemEffectToItems = (await DataUtilities.LoadDumpCsvAsync<DumpItemXItemEffect>("itemxitemeffect"))
            .ToGroupedDictionary(ixie => ixie.ItemEffectID);

        var itemEffects = await DataUtilities.LoadDumpCsvAsync<DumpItemEffect>("itemeffect");

        var spellEffectMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellEffect>("spelleffect"))
            .ToGroupedDictionary(se => se.SpellID);

        var dbMap = await Context.WowItemEffect
            .ToDictionaryAsync(wie => wie.ItemXItemEffectId);

        foreach (var dumpItemEffect in itemEffects)
        {
            if (dumpItemEffect.TriggerType == 0) // On Use
            {
                if (!spellEffectMap.TryGetValue(dumpItemEffect.SpellID, out var spellEffects))
                {
                    Logger.Debug("No spell effects? ItemEffect {ie}", dumpItemEffect.ID);
                    continue;
                }

                foreach (var spellEffect in spellEffects)
                {
                    if (!Enum.IsDefined(typeof(WowSpellEffectEffect), spellEffect.Effect))
                    {
                        continue;
                    }

                    foreach (var itemXItemEffect in itemEffectToItems[dumpItemEffect.ID])
                    {
                        if (!dbMap.TryGetValue(itemXItemEffect.ID, out var dbItemEffect))
                        {
                            dbItemEffect = dbMap[itemXItemEffect.ID] = new WowItemEffect
                            {
                                ItemXItemEffectId = itemXItemEffect.ID,
                            };
                            Context.WowItemEffect.Add(dbItemEffect);
                        }

                        dbItemEffect.Effect = (WowSpellEffectEffect)spellEffect.Effect;
                        dbItemEffect.ItemId = itemXItemEffect.ItemID;
                        dbItemEffect.Values = new[]
                        {
                            spellEffect.EffectMiscValue0,
                            spellEffect.EffectMiscValue1,
                        };
                    }
                }
            }
            else if (dumpItemEffect.TriggerType == 6) // On Learn
            {
                foreach (var itemXItemEffect in itemEffectToItems[dumpItemEffect.ID])
                {
                    if (!dbMap.TryGetValue(itemXItemEffect.ID, out var dbItemEffect))
                    {
                        dbItemEffect = dbMap[dumpItemEffect.ID] = new WowItemEffect
                        {
                            ItemXItemEffectId = itemXItemEffect.ID,
                        };
                        Context.WowItemEffect.Add(dbItemEffect);
                    }

                    dbItemEffect.Effect = WowSpellEffectEffect.LearnSpell;
                    dbItemEffect.ItemId = itemXItemEffect.ItemID;
                    dbItemEffect.Values = new[]
                    {
                        dumpItemEffect.SpellID,
                    };
                }
            }
        }

        _spellTeachMap = dbMap.Values
            .Where(wie => wie.Effect == WowSpellEffectEffect.LearnSpell)
            .ToGroupedDictionary(
                wie => wie.Values[0],
                wie => wie.ItemId
            );
        _itemEffectsMap = itemEffectToItems;

        _timer.AddPoint("ItemEffects");
    }

    private async Task ImportMounts()
    {
        var baseMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>(Path.Join("enUS", "mount"));

        var dbMountMap = await Context.WowMount
            .ToDictionaryAsync(mount => mount.Id);

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

            if (_spellTeachMap.TryGetValue(dbMount.SpellId, out var itemIds))
            {
                dbMount.ItemId = itemIds.Last();
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
            dbPet.SpellId = _fixedPetSpell.GetValueOrDefault(pet.ID, pet.SummonSpellID);
            dbPet.Flags = pet.Flags;
            dbPet.PetType = pet.PetTypeEnum;
            dbPet.SourceType = pet.SourceTypeEnum;

            if (_spellTeachMap.TryGetValue(dbPet.SpellId, out var itemIds))
            {
                dbPet.ItemId = itemIds.Last();
            }
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
