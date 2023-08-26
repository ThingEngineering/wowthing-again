using Serilog.Context;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Enums;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Covenants;
using Wowthing.Tool.Models.Holidays;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.Journal;
using Wowthing.Tool.Models.Professions;
using Wowthing.Tool.Models.Reputations;
using Wowthing.Tool.Models.Spells;
using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Tools;

public class DumpsTool
{
    private readonly Language[] _languages = Enum.GetValues<Language>();
    private readonly JankTimer _timer = new();

    private Dictionary<int, List<int>>? _spellTeachMap;
    private readonly Dictionary<Language, Dictionary<string, string>> _globalStringMap = new();

    private static readonly Dictionary<string, int> _inventorySlotMap = new()
    {
        { "AMMOSLOT", 0 },
        { "HEADSLOT", 1 },
        { "NECKSLOT", 2 },
        { "SHOULDERSLOT", 3 },
        { "SHIRTSLOT", 4 },
        { "CHESTSLOT", 5 },
        { "WAISTSLOT", 6 },
        { "LEGSSLOT", 7 },
        { "FEETSLOT", 8 },
        { "WRISTSLOT", 9 },
        { "HANDSSLOT", 10 },
        { "FINGER0SLOT", 11 },
        { "FINGER1SLOT", 12 },
        { "TRINKET0SLOT", 13 },
        { "TRINKET1SLOT", 14 },
        { "BACKSLOT", 15 },
        { "MAINHANDSLOT", 16 },
        { "SECONDARYHANDSLOT", 17 },
        { "RANGEDSLOT", 18 },
        { "TABARDSLOT", 19 },
        // { "BAGSLOT", 0 },
        // { "RELICSLOT", 0 },
        // { "SHIELDSLOT", 0 },
        { "PROF0TOOLSLOT", 20 },
        { "PROF0GEAR0SLOT", 21 },
        { "PROF0GEAR1SLOT", 22 },
        { "PROF1TOOLSLOT", 23 },
        { "PROF1GEAR0SLOT", 24 },
        { "PROF1GEAR1SLOT", 25 },
        { "COOKINGTOOLSLOT", 26 },
        { "COOKINGGEAR0SLOT", 27 },
        { "FISHINGTOOLSLOT", 28 },
        { "FISHINGGEAR0SLOT", 29 },
        { "FISHINGGEAR1SLOT", 30 },
    };

    private static readonly Dictionary<string, int> _inventoryTypeMap = new()
    {
        { "INVTYPE_NON_EQUIP", 0 },
        { "INVTYPE_HEAD", 1 },
        { "INVTYPE_NECK", 2 },
        { "INVTYPE_SHOULDER", 3 },
        { "INVTYPE_BODY", 4 }, // Shirt
        { "INVTYPE_CHEST", 5 },
        { "INVTYPE_WAIST", 6 },
        { "INVTYPE_LEGS", 7 },
        { "INVTYPE_FEET", 8 },
        { "INVTYPE_WRIST", 9 },
        { "INVTYPE_HAND", 10 },
        { "INVTYPE_FINGER", 11 },
        { "INVTYPE_TRINKET", 12 },
        { "INVTYPE_WEAPON", 13 },
        { "INVTYPE_SHIELD", 14 }, // Off Hand
        { "INVTYPE_RANGED", 15 },
        { "INVTYPE_CLOAK", 16 },
        { "INVTYPE_2HWEAPON", 17 },
        { "INVTYPE_BAG", 18 },
        { "INVTYPE_TABARD", 19 },
        { "INVTYPE_ROBE", 20 },
        { "INVTYPE_WEAPONMAINHAND", 21 },
        { "INVTYPE_WEAPONOFFHAND", 22 },
        { "INVTYPE_HOLDABLE", 23 }, // Held in Off-Hand
        { "INVTYPE_AMMO", 24 },
        { "INVTYPE_THROWN", 25 },
        { "INVTYPE_RANGEDRIGHT", 26 },
        { "INVTYPE_QUIVER", 27 },
        { "INVTYPE_RELIC", 28 },
        { "INVTYPE_PROFESSION_TOOL", 29 },
        { "INVTYPE_PROFESSION_GEAR", 30 },
        { "INVTYPE_EQUIPABLESPELL_OFFENSIVE", 31 },
        { "INVTYPE_EQUIPABLESPELL_UTILITY", 32 },
        { "INVTYPE_EQUIPABLESPELL_DEFENSIVE", 33 },
        { "INVTYPE_EQUIPABLESPELL_WEAPON", 34 },
    };

    private Dictionary<int, WowItem> _itemMap;

    public async Task Run()
    {
        Func<WowDbContext, Task>[] actions =
        {
            ImportCharacterClasses,
            ImportCharacterRaces,
            ImportCharacterSpecializations,
            ImportCurrencies,
            ImportCurrencyCategories,
            ImportFactions,
            ImportHolidays,
            ImportInstances,
            ImportItems,
            ImportItemAppearances,
            ImportItemBonuses,
            ImportItemEffects,
            ImportMounts,
            ImportPets,
            ImportRecipeItems,
            ImportReputationTiers,
            ImportToys,
            ImportTransmogSets,

            ImportInventoryStrings,

            ImportCharacterTitleStrings,
            ImportCreatureStrings,
            ImportJournalEncounterStrings,
            ImportJournalInstanceStrings,
            ImportJournalTierStrings,
            ImportKeystoneAffixStrings,
            ImportSharedStrings,
            ImportSkillLineStrings,
            ImportSoulbindStrings,
            ImportSpellItemEnchantmentStrings,
            ImportTransmogSetStrings,
            ImportTransmogSetGroupStrings,
        };

        foreach (var language in _languages)
        {
            _globalStringMap[language] = (
                await DataUtilities.LoadDumpCsvAsync<DumpGlobalStrings>("globalstrings", language)
            ).ToDictionary(gs => gs.BaseTag, gs => gs.TagText);

        }

        foreach (var action in actions)
        {
            using (LogContext.PushProperty("Task", $"Dumps: {action.Method.Name}"))
            {
                var watch = System.Diagnostics.Stopwatch.StartNew();
                ToolContext.Logger.Information("Starting...");

                await using var context = ToolContext.GetDbContext();
                await action(context);
                await context.SaveChangesAsync();

                watch.Stop();
                ToolContext.Logger.Information("Finished after {time}s",
                    watch.ElapsedMilliseconds / 1000.0);
            }
        }
    }

    private async Task ImportStrings<TDump>(
        WowDbContext context,
        StringType type,
        string dumpName,
        Func<TDump, int> getIdFunc,
        Func<TDump, string> getStringFunc,
        Func<TDump, bool>? filterFunc = null
    )
    {
        var dbLanguageMap = await context.LanguageString
            .Where(ls => ls.Type == type)
            .AsNoTracking()
            .ToDictionaryAsync(ls => (ls.Language, ls.Id));

        foreach (var language in _languages)
        {
            var dumpObjects = await DataUtilities.LoadDumpCsvAsync<TDump>(dumpName, language);
            // if (dumpObjects == null)
            // {
            //     ToolContext.Logger.Warning("No dump objects: {lang} {path}",
            //         language.ToString(), dumpName);
            //     continue;
            // }

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
                    context.LanguageString.Add(languageString);
                }
                else if (objectString != languageString.String)
                {
                    context.LanguageString.Update(languageString);
                    languageString.String = objectString;
                }
            }
        }

        _timer.AddPoint(type.ToString());
    }

    private async Task ImportCharacterTitleStrings(WowDbContext context) =>
        await ImportStrings<DumpCharTitles>(
            context,
            StringType.WowCharacterTitle,
            "chartitles",
            title => title.ID,
            title => $"{title.MaleName}|{title.FemaleName}"
        );

    private async Task ImportCreatureStrings(WowDbContext context) =>
        await ImportStrings<DumpCreature>(
            context,
            StringType.WowCreatureName,
            "creature",
            creature => creature.ID,
            creature => creature.Name
        );

    private async Task ImportJournalEncounterStrings(WowDbContext context) =>
        await ImportStrings<DumpJournalEncounter>(
            context,
            StringType.WowJournalEncounterName,
            "journalencounter",
            encounter => encounter.ID,
            encounter => encounter.Name
        );

    private async Task ImportJournalInstanceStrings(WowDbContext context) =>
        await ImportStrings<DumpJournalInstance>(
            context,
            StringType.WowJournalInstanceName,
            "journalinstance",
            instance => instance.ID,
            instance => instance.Name
        );

    private async Task ImportJournalTierStrings(WowDbContext context) =>
        await ImportStrings<DumpJournalTier>(
            context,
            StringType.WowJournalTierName,
            "journaltier",
            tier => tier.ID,
            tier => tier.Name
        );

    private async Task ImportKeystoneAffixStrings(WowDbContext context) =>
        await ImportStrings<DumpKeystoneAffix>(
            context,
            StringType.WowKeystoneAffixName,
            "keystoneaffix",
            affix => affix.ID,
            affix => affix.Name
        );

    private async Task ImportSharedStrings(WowDbContext context) =>
        await ImportStrings<DumpSharedString>(
            context,
            StringType.WowSharedString,
            "sharedstring",
            sharedString => sharedString.ID,
            sharedString => sharedString.String
        );

    private async Task ImportSkillLineStrings(WowDbContext context) =>
        await ImportStrings<DumpSkillLine>(
            context,
            StringType.WowSkillLineName,
            "skillline",
            line => line.ID,
            line => $"{line.DisplayName}|{line.HordeDisplayName}"
        );

    private async Task ImportSoulbindStrings(WowDbContext context) =>
        await ImportStrings<DumpSoulbind>(
            context,
            StringType.WowSoulbindName,
            "soulbind",
            soulbind => soulbind.ID,
            soulbind => soulbind.Name
        );

    private async Task ImportSpellItemEnchantmentStrings(WowDbContext context) =>
        await ImportStrings<DumpSpellItemEnchantment>(
            context,
            StringType.WowSpellItemEnchantmentName,
            "spellitemenchantment",
            ench => ench.ID,
            ench => ench.Name
        );

    private async Task ImportTransmogSetStrings(WowDbContext context) =>
        await ImportStrings<DumpTransmogSet>(
            context,
            StringType.WowTransmogSetName,
            "transmogset",
            set => set.ID,
            set => set.Name
        );

    private async Task ImportTransmogSetGroupStrings(WowDbContext context) =>
        await ImportStrings<DumpTransmogSetGroup>(
            context,
            StringType.WowTransmogSetGroupName,
            "transmogsetgroup",
            group => group.ID,
            group => group.Name
        );

    private async Task ImportCharacterClasses(WowDbContext context)
    {
        var classes = await DataUtilities
            .LoadDumpCsvAsync<DumpChrClasses>("chrclasses");

        var dbClassMap = await context.WowCharacterClass
            .ToDictionaryAsync(spec => spec.Id);

        foreach (var cls in classes)
        {
            if (!dbClassMap.TryGetValue(cls.ID, out var dbClass))
            {
                dbClass = new WowCharacterClass(cls.ID);
                context.WowCharacterClass.Add(dbClass);
            }

            dbClass.ArmorMask = cls.ArmorTypeMask;
            dbClass.RolesMask = cls.RolesMask;
            dbClass.Slug = cls.MaleName.Slugify();
        }

        _timer.AddPoint("CharacterClasses");

        await ImportStrings<DumpChrClasses>(
            context,
            StringType.WowCharacterClassName,
            "chrclasses",
            cls => cls.ID,
            cls => $"{cls.MaleName}|{cls.FemaleName}"
        );
    }

    private async Task ImportCharacterRaces(WowDbContext context)
    {
        var dumpRaces = await DataUtilities
            .LoadDumpCsvAsync<DumpChrRaces>("chrraces");

        var dbRaceMap = await context.WowCharacterRace
            .ToDictionaryAsync(race => race.Id);

        foreach (var dumpRace in dumpRaces.Where(race => race.PlayableRaceBit >= 0))
        {
            if (!dbRaceMap.TryGetValue(dumpRace.ID, out var dbRace))
            {
                dbRace = new WowCharacterRace(dumpRace.ID);
                context.WowCharacterRace.Add(dbRace);
            }

            dbRace.Faction = dumpRace.Faction;
        }

        _timer.AddPoint("CharacterRaces");

        await ImportStrings<DumpChrRaces>(
            context,
            StringType.WowCharacterRaceName,
            "chrraces",
            race => race.ID,
            race => $"{race.Name}|{race.FemaleName}"
        );
    }

    private async Task ImportCharacterSpecializations(WowDbContext context)
    {
        var specs = await DataUtilities
            .LoadDumpCsvAsync<DumpChrSpecialization>("chrspecialization");

        var dbSpecMap = await context.WowCharacterSpecialization
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
                context.WowCharacterSpecialization.Add(dbSpec);
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
            context,
            StringType.WowCharacterSpecializationName,
            "chrspecialization",
            spec => spec.ID,
            spec => $"{spec.Name}|{spec.FemaleName}"
        );
    }

    private async Task ImportCurrencies(WowDbContext context)
    {
        var currencies = await DataUtilities
            .LoadDumpCsvAsync<DumpCurrencyTypes>("currencytypes");

        var dbCurrencyMap = await context.WowCurrency
            .ToDictionaryAsync(currency => currency.Id);

        foreach (var currency in currencies)
        {
            if (!dbCurrencyMap.TryGetValue(currency.ID, out var dbCurrency))
            {
                dbCurrency = dbCurrencyMap[currency.ID] = new WowCurrency(currency.ID);
                context.WowCurrency.Add(dbCurrency);
            }

            dbCurrency.CategoryId = currency.CategoryID;
            dbCurrency.MaxPerWeek = currency.MaxEarnablePerWeek;
            dbCurrency.MaxTotal = currency.MaxQty;
        }

        _timer.AddPoint("Currency");

        await ImportStrings<DumpCurrencyTypes>(
            context,
            StringType.WowCurrencyName,
            "currencytypes",
            currency => currency.ID,
            currency => currency.Name
        );
    }

    private async Task ImportCurrencyCategories(WowDbContext context)
    {
        var categories = await DataUtilities
            .LoadDumpCsvAsync<DumpCurrencyCategory>("currencycategory");

        var dbCategoryMap = await context.WowCurrencyCategory
            .ToDictionaryAsync(currency => currency.Id);

        foreach (var category in categories)
        {
            if (!dbCategoryMap.TryGetValue(category.ID, out var dbCategory))
            {
                dbCategory = dbCategoryMap[category.ID] = new WowCurrencyCategory(category.ID);
                context.WowCurrencyCategory.Add(dbCategory);
            }

            dbCategory.Expansion = category.ExpansionID;
            dbCategory.Flags = category.Flags;
        }

        _timer.AddPoint("CurrencyCategory");

        await ImportStrings<DumpCurrencyCategory>(
            context,
            StringType.WowCurrencyCategoryName,
            "currencycategory",
            category => category.ID,
            category => category.Name
        );
    }

    private async Task ImportFactions(WowDbContext context)
    {
        var factions = await DataUtilities
            .LoadDumpCsvAsync<DumpFaction>("faction");

        var dbReputationMap = await context.WowReputation
            .ToDictionaryAsync(rep => rep.Id);

        foreach (var faction in factions)
        {
            if (!dbReputationMap.TryGetValue(faction.ID, out var dbReputation))
            {
                dbReputation = dbReputationMap[faction.ID] = new WowReputation(faction.ID);
                context.WowReputation.Add(dbReputation);
            }

            dbReputation.Expansion = faction.Expansion;
            dbReputation.ParagonId = faction.ParagonFactionID;
            dbReputation.ParentId = faction.ParentFactionID;
            dbReputation.TierId = faction.FriendshipRepID;
        }

        _timer.AddPoint("Faction");

        await ImportStrings<DumpFaction>(
            context,
            StringType.WowReputationName,
            "faction",
            faction => faction.ID,
            faction => faction.Name
        );

        await ImportStrings<DumpFaction>(
            context,
            StringType.WowReputationDescription,
            "faction",
            faction => faction.ID,
            faction => faction.Description
        );
    }

    private async Task ImportHolidays(WowDbContext context)
    {
        var holidays = await DataUtilities
            .LoadDumpCsvAsync<DumpHolidays>("holidays");

        var dbHolidayMap = await context.WowHoliday
            .ToDictionaryAsync(holiday => holiday.Id);

        foreach (var holiday in holidays)
        {
            if (!dbHolidayMap.TryGetValue(holiday.ID, out var dbHoliday))
            {
                dbHoliday = dbHolidayMap[holiday.ID] = new WowHoliday(holiday.ID);
                context.WowHoliday.Add(dbHoliday);
            }

            dbHoliday.FilterType = holiday.CalendarFilterType;
            dbHoliday.Flags = holiday.Flags;
            dbHoliday.Looping = holiday.Looping;
            dbHoliday.Priority = holiday.Priority;
            dbHoliday.Region = holiday.Region;

            dbHoliday.Durations = holiday.Durations
                .Where(duration => duration > 0)
                .ToList();

            dbHoliday.StartDates = holiday.Dates
                .Select(DateTimeUtilities.ParseBlizzardDateTime)
                .Where(date => date > MiscConstants.DefaultDateTime)
                .OrderBy(date => date)
                .ToList();
        }

        var nameMap = (await DataUtilities.LoadDumpCsvAsync<DumpHolidayNames>("holidaynames"))
            .ToDictionary(dhn => dhn.ID, dhn => dhn.Name);

        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == Language.enUS && ls.Type == StringType.WowHolidayName)
            .ToDictionaryAsync(ls => ls.Id);

        // TODO fix language support with dumps
        foreach (var holiday in holidays)
        {
            if (!nameMap.TryGetValue(holiday.HolidayNameID, out string? name))
            {
                // ToolContext.Logger.Warning("No holiday name for {holidayId} {nameId}",
                //     holiday.ID, holiday.HolidayNameID);
                continue;
            }

            if (!dbLanguageMap.TryGetValue(holiday.ID, out var languageString))
            {
                languageString = new LanguageString
                {
                    Language = Language.enUS,
                    Type = StringType.WowHolidayName,
                    Id = holiday.ID,
                    String = name,
                };
                context.LanguageString.Add(languageString);
            }
            else if (name != languageString.String)
            {
                context.LanguageString.Update(languageString);
                languageString.String = name;
            }
        }

        _timer.AddPoint("Holidays");
    }

    private async Task ImportInstances(WowDbContext context)
    {
        var instances = await DataUtilities
            .LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");

        var mapIdToInstanceId = instances
            .Where(instance => !Hardcoded.SkipInstances.Contains(instance.ID))
            .ToDictionary(
                instance => instance.MapID,
                instance => instance.ID
            );

        _timer.AddPoint("Instances");

        await ImportStrings<DumpMap>(
            context,
            StringType.WowJournalInstanceMapName,
            "map",
            (map) => mapIdToInstanceId[map.ID],
            (map) => map.Name,
            (map) => mapIdToInstanceId.ContainsKey(map.ID)
        );
    }

    private async Task ImportItems(WowDbContext context)
    {
        var items = await DataUtilities.LoadDumpCsvAsync<DumpItem>("item");

        var baseItemSparseMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>("itemsparse"))
            .ToDictionary(itemSparse => itemSparse.ID);

        _itemMap = await context.WowItem.ToDictionaryAsync(item => item.Id);

        foreach (var item in items)
        {
            if (!baseItemSparseMap.TryGetValue(item.ID, out var itemSparse))
            {
                ToolContext.Logger.Debug("Item with no matching ItemSparse: {Id}", item.ID);
                continue;
            }

            if (!_itemMap.TryGetValue(item.ID, out var dbItem))
            {
                _itemMap[item.ID] = dbItem = new WowItem(item.ID);
                context.WowItem.Add(dbItem);
            }

            dbItem.BindType = itemSparse.Bonding;
            dbItem.ContainerSlots = itemSparse.ContainerSlots;
            dbItem.Expansion = itemSparse.ExpansionID;
            dbItem.ItemLevel = itemSparse.ItemLevel;
            dbItem.Quality = (WowQuality)itemSparse.OverallQualityID;
            dbItem.RaceMask = itemSparse.AllowableRace;
            dbItem.RequiredLevel = itemSparse.RequiredLevel;
            dbItem.RequiredSkill = itemSparse.RequiredSkill;
            dbItem.RequiredSkillRank = itemSparse.RequiredSkillRank;
            dbItem.Stackable = itemSparse.Stackable;
            dbItem.Unique = (short)(itemSparse.MaxCount & 0x7FFF);

            // Flags
            if (itemSparse.Flags2.HasFlag(WowItemFlags2.CannotTransmogToThisItem))
            {
                dbItem.Flags |= WowItemFlags.CannotTransmogToThisItem;
            }

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

            if (Hardcoded.ItemClassOverride.TryGetValue(item.ID, out var classTuple))
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
        }

        foreach (var language in _languages)
        {
            await ImportItemStrings(context, language);
        }

        _timer.AddPoint("Items");
    }

    private async Task ImportItemStrings(WowDbContext context, Language language)
    {
        var itemSparses = await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>("itemsparse", language);

        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == language && ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(ls => ls.Id);

        foreach (var itemSparse in itemSparses)
        {
            if (!dbLanguageMap.TryGetValue(itemSparse.ID, out var languageString))
            {
                languageString = new LanguageString
                {
                    Language = language,
                    Type = StringType.WowItemName,
                    Id = itemSparse.ID,
                    String = itemSparse.Name,
                };
                context.LanguageString.Add(languageString);
            }
            else if (itemSparse.Name != languageString.String)
            {
                context.LanguageString.Update(languageString);
                languageString.String = itemSparse.Name;
            }
        }
    }

    private async Task ImportItemAppearances(WowDbContext context)
    {
        var itemModifiedAppearances =
            await DataUtilities.LoadDumpCsvAsync<DumpItemModifiedAppearance>("itemmodifiedappearance");
        var dbMap = await context.WowItemModifiedAppearance
            .ToDictionaryAsync(wima => wima.Id);

        foreach (var ima in itemModifiedAppearances)
        {
            if (!dbMap.TryGetValue(ima.ID, out var dbAppearance))
            {
                dbAppearance = new WowItemModifiedAppearance(ima.ID);
                context.WowItemModifiedAppearance.Add(dbAppearance);
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

    private async Task ImportItemBonuses(WowDbContext context)
    {
        var dumpMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemBonus>("itembonus"))
            .GroupBy(dib => dib.ParentItemBonusListID)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(dib => dib.OrderIndex).ToArray()
            );

        var dbMap = await context.WowItemBonus
            .ToDictionaryAsync(wib => wib.Id);

        foreach (var (itemBonusId, dumpItemBonuses) in dumpMap)
        {
            if (!dbMap.TryGetValue(itemBonusId, out var dbItemBonus))
            {
                dbItemBonus = new WowItemBonus(itemBonusId);
                context.WowItemBonus.Add(dbItemBonus);
            }

            dbItemBonus.BonusTypeFlags = 0;
            dbItemBonus.Bonuses = new();
            foreach (var dumpItemBonus in dumpItemBonuses)
            {
                if (dumpItemBonus.Type > 0)
                {
                    dbItemBonus.BonusTypeFlags |= (uint)1 << (dumpItemBonus.Type - 1);

                    var bonusList = new List<int>
                    {
                        dumpItemBonus.Type,
                        dumpItemBonus.Value0,
                    };

                    if (dumpItemBonus.Value2 != 0 || dumpItemBonus.Value1 != 0)
                    {
                        bonusList.Add(dumpItemBonus.Value1);
                    }
                    if (dumpItemBonus.Value2 != 0)
                    {
                        bonusList.Add(dumpItemBonus.Value2);
                    }

                    dbItemBonus.Bonuses.Add(bonusList);
                }
            }
        }
    }

    private async Task ImportItemEffects(WowDbContext context)
    {
        var itemEffectToItems = (await DataUtilities.LoadDumpCsvAsync<DumpItemXItemEffect>("itemxitemeffect"))
            .ToGroupedDictionary(ixie => ixie.ItemEffectID);

        var itemEffects = await DataUtilities.LoadDumpCsvAsync<DumpItemEffect>("itemeffect");

        var spellEffectMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellEffect>("spelleffect"))
            .ToGroupedDictionary(se => se.SpellID);

        _spellTeachMap = new();
        var newMap = new Dictionary<int, WowItemEffectV2>();
        foreach (var dumpItemEffect in itemEffects)
        {
            if (dumpItemEffect.TriggerType == 0) // On Use
            {
                if (!spellEffectMap.TryGetValue(dumpItemEffect.SpellID, out var spellEffects))
                {
                    ToolContext.Logger.Debug("No spell effects? ItemEffect {ie}", dumpItemEffect.ID);
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
                        if (!newMap.TryGetValue(itemXItemEffect.ItemID, out var newItemEffect))
                        {
                            newItemEffect = newMap[itemXItemEffect.ItemID] = new()
                            {
                                ItemId = itemXItemEffect.ItemID,
                            };
                        }

                        if (!newItemEffect.SpellEffects.TryGetValue(spellEffect.SpellID, out var newSpellEffects))
                        {
                            newSpellEffects = newItemEffect.SpellEffects[spellEffect.SpellID] = new();
                        }

                        newSpellEffects[spellEffect.EffectIndex] = new()
                        {
                            Effect = (WowSpellEffectEffect)spellEffect.Effect,
                            Values = new[]
                            {
                                spellEffect.EffectMiscValue0,
                                spellEffect.EffectMiscValue1,
                            },
                        };

                        if (spellEffect.Effect == (int)WowSpellEffectEffect.LearnSpell && spellEffect.EffectTriggerSpell > 0)
                        {
                            if (!_spellTeachMap.TryGetValue(spellEffect.EffectTriggerSpell, out var teachItemIds))
                            {
                                teachItemIds = _spellTeachMap[spellEffect.EffectTriggerSpell] = new();
                            }
                            teachItemIds.Add(itemXItemEffect.ItemID);
                        }
                    }
                }
            }
            else if (dumpItemEffect.TriggerType == 6) // On Learn
            {
                foreach (var itemXItemEffect in itemEffectToItems[dumpItemEffect.ID])
                {
                    if (!newMap.TryGetValue(itemXItemEffect.ItemID, out var newItemEffect))
                    {
                        newItemEffect = newMap[itemXItemEffect.ItemID] = new()
                        {
                            ItemId = itemXItemEffect.ItemID,
                        };
                    }

                    if (!newItemEffect.SpellEffects.TryGetValue(dumpItemEffect.SpellID, out var newSpellEffects))
                    {
                        newSpellEffects = newItemEffect.SpellEffects[dumpItemEffect.SpellID] = new();
                    }

                    newSpellEffects[0] = new()
                    {
                        Effect = WowSpellEffectEffect.LearnSpell,
                        Values = new[]
                        {
                            dumpItemEffect.SpellID,
                        },
                    };

                    if (!_spellTeachMap.TryGetValue(dumpItemEffect.SpellID, out var teachItemIds))
                    {
                        teachItemIds = _spellTeachMap[dumpItemEffect.SpellID] = new();
                    }
                    teachItemIds.Add(itemXItemEffect.ItemID);
                }
            }
        }

        var dbMap = await context.WowItemEffectV2
            .ToDictionaryAsync(wie2 => wie2.ItemId);

        foreach (var newEffect in newMap.Values)
        {
            if (!dbMap.TryGetValue(newEffect.ItemId, out var dbEffect))
            {
                dbMap[newEffect.ItemId] = newEffect;
                context.WowItemEffectV2.Add(newEffect);
            }
            else
            {
                dbEffect.SpellEffects = newEffect.SpellEffects;
            }
        }

        _timer.AddPoint("ItemEffects");
    }

    private async Task ImportMounts(WowDbContext context)
    {
        var baseMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>("mount");

        var dbMountMap = await context.WowMount
            .ToDictionaryAsync(mount => mount.Id);

        var dbLanguageMap = await context.LanguageString
            .Where(ls => ls.Type == StringType.WowMountName)
            .AsNoTracking()
            .ToDictionaryAsync(ls => (ls.Language, ls.Id));

        foreach (var mount in baseMounts)
        {
            if (!dbMountMap.TryGetValue(mount.ID, out var dbMount))
            {
                dbMount = new WowMount(mount.ID);
                context.WowMount.Add(dbMount);
            }

            dbMount.Flags = mount.Flags;
            dbMount.SourceType = mount.SourceTypeEnum;
            dbMount.SpellId = mount.SourceSpellID;

            dbMount.ItemId = 0;
            if (_spellTeachMap!.TryGetValue(dbMount.SpellId, out var itemIds))
            {
                foreach (int itemId in itemIds)
                {
                    if (_itemMap.TryGetValue(itemId, out var item) &&
                        item.BindType is WowBindType.NotBound or WowBindType.BindOnEquip or WowBindType.BindOnUse)
                    {
                        dbMount.ItemId = itemId;
                        break;
                    }
                }

                if (dbMount.ItemId == 0)
                {
                    dbMount.ItemId = itemIds.Last();
                }
            }

            if (!dbLanguageMap.TryGetValue((Language.enUS, mount.ID), out var languageString))
            {
                dbLanguageMap[(Language.enUS, mount.ID)] = languageString = new LanguageString
                {
                    Language = Language.enUS,
                    Type = StringType.WowMountName,
                    Id = mount.ID,
                    String = mount.Name,
                };
                context.LanguageString.Add(languageString);
            }
            else if (mount.Name != languageString.String)
            {
                context.LanguageString.Update(languageString);
                languageString.String = mount.Name;
            }
        }

        foreach (var language in _languages)
        {
            var languageMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>("mount", language);
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
                    context.LanguageString.Add(languageString);
                }
                else if (mount.Name != languageString.String)
                {
                    context.LanguageString.Update(languageString);
                    languageString.String = mount.Name;
                }
            }
        }

        _timer.AddPoint("Mounts");
    }

    private async Task ImportPets(WowDbContext context)
    {
        var pets = await DataUtilities.LoadDumpCsvAsync<DumpBattlePetSpecies>("battlepetspecies");

        var dbPetMap = await context.WowPet
            .ToDictionaryAsync(pet => pet.Id);

        foreach (var pet in pets)
        {
            if (!dbPetMap.TryGetValue(pet.ID, out var dbPet))
            {
                dbPet = new WowPet(pet.ID);
                context.WowPet.Add(dbPet);
            }

            dbPet.CreatureId = pet.CreatureID;
            dbPet.SpellId = Hardcoded.PetSpellOverride.GetValueOrDefault(pet.ID, pet.SummonSpellID);
            dbPet.Flags = pet.Flags;
            dbPet.PetType = pet.PetTypeEnum;
            dbPet.SourceType = pet.SourceTypeEnum;

            if (_spellTeachMap!.TryGetValue(dbPet.SpellId, out var itemIds))
            {
                dbPet.ItemId = itemIds.Last();
            }
        }

        _timer.AddPoint("Pets");
    }

    private async Task ImportRecipeItems(WowDbContext context)
    {
        var dbRecipeMap = await context.WowProfessionRecipeItem
            .ToDictionaryAsync(wpri => (wpri.SkillLineAbilityId, wpri.ItemId));

        var skillLineAbilities = await DataUtilities.LoadDumpCsvAsync<DumpSkillLineAbility>("skilllineability");

        var seen = new HashSet<(int, int)>();
        foreach (var skillLineAbility in skillLineAbilities)
        {
            if (skillLineAbility.Spell == 0 || !_spellTeachMap.TryGetValue(skillLineAbility.Spell, out var recipeItemIds))
            {
                continue;
            }

            foreach (int recipeItemId in recipeItemIds)
            {
                var item = _itemMap.GetValueOrDefault(recipeItemId);
                if (item?.BindType is WowBindType.BindOnUse or WowBindType.NotBound)
                {
                    var key = (skillLineAbility.ID, recipeItemId);
                    seen.Add(key);

                    if (!dbRecipeMap.TryGetValue(key, out var dbRecipe))
                    {
                        dbRecipe = dbRecipeMap[key] = new()
                        {
                            SkillLineAbilityId = skillLineAbility.ID,
                            ItemId = recipeItemId,
                        };
                        context.WowProfessionRecipeItem.Add(dbRecipe);
                    }

                    dbRecipe.SkillLineId = skillLineAbility.SkillLine;
                }
            }
        }

        // TODO deletes

        _timer.AddPoint("RecipeItems");
    }

    private async Task ImportReputationTiers(WowDbContext context)
    {
        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowReputationTier)
            .ToDictionaryAsync(ls => (ls.Language, ls.Id));

        foreach (var language in _languages)
        {
            var groupedTiers =
                (await DataUtilities.LoadDumpCsvAsync<DumpFriendshipRepReaction>("friendshiprepreaction", language))
                .GroupBy(tier => tier.FriendshipRepID)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .OrderBy(tier => tier.ReactionThreshold)
                        .ToArray()
            );

            if (language == Language.enUS)
            {
                var dbTierMap = await context.WowReputationTier
                    .ToDictionaryAsync(tier => tier.Id);

                if (!dbTierMap.ContainsKey(0))
                {
                    dbTierMap[0] = new WowReputationTier(0)
                    {
                        MinValues = new[] { -42000, -6000, -3000, 0, 3000, 9000, 21000, 42000 },
                    };
                    context.WowReputationTier.Add(dbTierMap[0]);
                }

                foreach (var (tierId, tiers) in groupedTiers)
                {
                    if (!dbTierMap.TryGetValue(tierId, out var dbTier))
                    {
                        dbTier = new WowReputationTier(tierId);
                        context.WowReputationTier.Add(dbTier);
                    }

                    dbTier.MinValues = tiers
                        .Select(tier => tier.ReactionThreshold)
                        .ToArray();
                }
            }

            // Hack for weird hardcoded OG tier
            var basicString = string.Join(
                '|',
                _globalStringMap[language]
                    .Where(kvp => kvp.Key.StartsWith("FACTION_STANDING_LABEL") && kvp.Key.Length == 23)
                    .OrderBy(kvp => kvp.Key)
                    .Select(kvp => kvp.Value)
            );
            if (!dbLanguageMap.TryGetValue((language, 0), out var basicLanguageString))
            {
                context.LanguageString.Add(new LanguageString
                {
                    Language = language,
                    Type = StringType.WowReputationTier,
                    Id = 0,
                    String = basicString,
                });
            }
            else if (basicString != basicLanguageString.String)
            {
                context.LanguageString.Update(basicLanguageString);
                basicLanguageString.String = basicString;
            }
            // End hack

            foreach (var (tierId, tiers) in groupedTiers)
            {
                var tierString = string.Join('|', tiers.Select(tier => tier.Reaction));

                if (!dbLanguageMap.TryGetValue((language, tierId), out var languageString))
                {
                    languageString = dbLanguageMap[(language, tierId)] = new LanguageString
                    {
                        Language = language,
                        Type = StringType.WowReputationTier,
                        Id = tierId,
                        String = tierString,
                    };
                    context.LanguageString.Add(languageString);
                }
                else if (tierString != languageString.String)
                {
                    context.LanguageString.Update(languageString);
                    languageString.String = tierString;
                }
            }
        }

        _timer.AddPoint("ReputationTiers");
    }

    private async Task ImportToys(WowDbContext context)
    {
        var toys = await DataUtilities.LoadDumpCsvAsync<DumpToy>("toy");

        var dbToyMap = await context.WowToy.ToDictionaryAsync(toy => toy.Id);

        foreach (var toy in toys)
        {
            if (!dbToyMap.TryGetValue(toy.ID, out var dbToy))
            {
                dbToy = new WowToy(toy.ID);
                context.WowToy.Add(dbToy);
            }

            dbToy.ItemId = toy.ItemID;
            dbToy.Flags = toy.Flags;
            dbToy.SourceType = toy.SourceTypeEnum;
        }

        _timer.AddPoint("Toys");
    }

    private async Task ImportTransmogSets(WowDbContext context)
    {
        var transmogSets = await DataUtilities.LoadDumpCsvAsync<DumpTransmogSet>("transmogset");
        var transmogSetItems = await DataUtilities.LoadDumpCsvAsync<DumpTransmogSetItem>("transmogsetitem");

        var itemsBySet = transmogSetItems.ToGroupedDictionary(tsi => tsi.TransmogSetID);

        var dbSetMap = await context.WowTransmogSet.ToDictionaryAsync(set => set.Id);

        foreach (var transmogSet in transmogSets)
        {
            if (!itemsBySet.TryGetValue(transmogSet.ID, out var items))
            {
                ToolContext.Logger.Warning("No set items for set {id}", transmogSet.ID);
                continue;
            }

            if (!dbSetMap.TryGetValue(transmogSet.ID, out var dbSet))
            {
                dbSet = new WowTransmogSet(transmogSet.ID);
                context.WowTransmogSet.Add(dbSet);
            }

            dbSet.ClassMask = transmogSet.ClassMask;
            dbSet.Flags = transmogSet.Flags;
            dbSet.GroupId = transmogSet.TransmogSetGroupID;
            dbSet.ItemNameDescriptionId = transmogSet.ItemNameDescriptionID;

            dbSet.ItemModifiedAppearanceIds = items
                .OrderByDescending(dtsi => Hardcoded.TransmogSetItemPrimaryOverride
                    .GetValueOrDefault(dtsi.ID, dtsi.Flags & 0x1))
                .ThenBy(dtsi => dtsi.ItemModifiedAppearanceID)
                .Select(dtsi => dtsi.ItemModifiedAppearanceID)
                .ToList();
        }

        _timer.AddPoint("TransmogSets");
    }

    private async Task ImportInventoryStrings(WowDbContext context)
    {
        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowInventorySlot || ls.Type == StringType.WowInventoryType)
            .ToDictionaryAsync(ls => (ls.Type, ls.Language, ls.Id));

        foreach (var language in _languages)
        {
            foreach (var (stringKey, slotId) in _inventorySlotMap)
            {
                var stringValue = _globalStringMap[language][stringKey];

                if (!dbLanguageMap.TryGetValue((StringType.WowInventorySlot, language, slotId), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = language,
                        Type = StringType.WowInventorySlot,
                        Id = slotId,
                        String = stringValue,
                    };
                    context.LanguageString.Add(languageString);
                }
                else if (stringValue != languageString.String)
                {
                    context.LanguageString.Update(languageString);
                    languageString.String = stringValue;
                }
            }

            foreach (var (stringKey, slotId) in _inventoryTypeMap)
            {
                if (!_globalStringMap[language].TryGetValue(stringKey, out string stringValue))
                {
                    ToolContext.Logger.Warning("Missing globalstrings key: {key}", stringKey);
                    continue;
                }

                if (!dbLanguageMap.TryGetValue((StringType.WowInventoryType, language, slotId), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = language,
                        Type = StringType.WowInventoryType,
                        Id = slotId,
                        String = stringValue,
                    };
                    context.LanguageString.Add(languageString);
                }
                else if (stringValue != languageString.String)
                {
                    context.LanguageString.Update(languageString);
                    languageString.String = stringValue;
                }
            }

        }

        _timer.AddPoint("InventoryStrings");
    }
}
