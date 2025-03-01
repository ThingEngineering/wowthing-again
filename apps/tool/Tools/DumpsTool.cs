using System.Collections;
using Serilog.Context;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Enums;
using Wowthing.Tool.Extensions;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Achievements;
using Wowthing.Tool.Models.Covenants;
using Wowthing.Tool.Models.Holidays;
using Wowthing.Tool.Models.Items;
using Wowthing.Tool.Models.Journal;
using Wowthing.Tool.Models.Professions;
using Wowthing.Tool.Models.Quests;
using Wowthing.Tool.Models.Reputations;
using Wowthing.Tool.Models.Spells;
using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Tools;

public class DumpsTool
{
    private readonly Language[] _languages = Enum.GetValues<Language>();
    private readonly JankTimer _timer = new();

    private readonly Dictionary<int, List<int>> _completeQuestByItemId = new();
    private readonly Dictionary<int, List<int>> _teachSpellByItemId = new ();
    private readonly Dictionary<int, List<int>> _teachSpellBySpellId = new();
    private readonly Dictionary<int, List<int>> _teachTransmogSetByItemId = new();
    private readonly Dictionary<Language, Dictionary<string, string>> _globalStringMap = new();

    private static readonly Dictionary<string, int> InventorySlotMap = new()
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

    private static readonly Dictionary<string, int> InventoryTypeMap = new()
    {
        { "INVTYPE_NON_EQUIP", 0 },
        { "INVTYPE_HEAD", 1 },
        { "INVTYPE_NECK", 2 },
        { "SHOULDERSLOT", 3 }, // English at least has "Shoulder" for type vs "Shoulders" for slot, bizarre
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
            ImportCampaigns,
            ImportCharacterClasses,
            ImportCharacterRaces,
            ImportCharacterSpecializations,
            ImportCurrencies,
            ImportCurrencyCategories,
            ImportFactions,
            ImportHolidays,
            ImportInstances,
            ImportItemAppearances,
            ImportItemBonuses,
            ImportItemClasses,
            ImportItemEffects,
            ImportItems, // must be AFTER ItemEffects
            ImportMounts,
            ImportPets,
            ImportQuestLines,
            ImportRecipeItems,
            ImportReputationTiers,
            ImportToys,
            ImportTransmogSets,
            ImportWorldQuests,

            ImportGlobalStrings,

            ImportCampaignStrings,
            ImportCharacterTitleStrings,
            ImportCreatureStrings,
            ImportJournalEncounterStrings,
            ImportJournalTierStrings,
            ImportKeystoneAffixStrings,
            ImportQuestLineStrings,
            ImportQuestV2CliTaskStrings,
            ImportSharedStrings,
            ImportSkillLineStrings,
            ImportSoulbindStrings,
            ImportSpellItemEnchantmentStrings,
            ImportSpellNameStrings,
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

        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private void CreateOrUpdateString(
        WowDbContext context,
        Dictionary<(Language, StringType, int), LanguageString> dbLanguageMap,
        Language language,
        StringType type,
        int id,
        string value
    )
    {
        if (!dbLanguageMap.TryGetValue((language, type, id), out var languageString))
        {
            languageString = new LanguageString
            {
                Language = language,
                Type = type,
                Id = id,
                String = value,
            };
            context.LanguageString.Add(languageString);
        }
        else if (value != languageString.String)
        {
            languageString.String = value;
            context.LanguageString.Update(languageString);
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
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

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

                CreateOrUpdateString(context, dbLanguageMap, language, type, objectId, objectString);
            }
        }

        _timer.AddPoint(type.ToString());
    }

    private async Task ImportCampaignStrings(WowDbContext context) =>
        await ImportStrings<DumpCampaign>(
            context,
            StringType.WowCampaignName,
            "campaign",
            campaign => campaign.ID,
            campaign => campaign.Title
        );

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

    private async Task ImportQuestLineStrings(WowDbContext context) =>
        await ImportStrings<DumpQuestLine>(
            context,
            StringType.WowQuestLineName,
            "questline",
            questLine => questLine.ID,
            questLine => questLine.Name
        );

    private async Task ImportQuestV2CliTaskStrings(WowDbContext context) =>
        await ImportStrings<DumpQuestV2CliTask>(
            context,
            StringType.WowQuestName,
            "questv2clitask",
            qv2 => qv2.ID,
            qv2 => qv2.Title
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

    private async Task ImportSpellNameStrings(WowDbContext context) =>
        await ImportStrings<DumpSpellName>(
            context,
            StringType.WowSpellName,
            "spellname",
            spellName => spellName.ID,
            spellName => spellName.Name
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

    private async Task ImportCampaigns(WowDbContext context)
    {
        var campaignXQuestLines = await DataUtilities
            .LoadDumpCsvAsync<DumpCampaignXQuestLine>("campaignxquestline");

        var questLinesByCampaign = campaignXQuestLines
            .GroupBy(q => q.CampaignID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(ql => ql.OrderIndex)
                    .Select(ql => ql.QuestLineID)
                    .ToList()
            );

        var dbCampaignMap = await context.WowCampaign
            .ToDictionaryAsync(campaign => campaign.Id);

        foreach ((int campaignId, var questLineIds) in questLinesByCampaign)
        {
            if (!dbCampaignMap.TryGetValue(campaignId, out var dbCampaign))
            {
                dbCampaign = new WowCampaign(campaignId);
                context.WowCampaign.Add(dbCampaign);
            }

            if (dbCampaign.QuestLineIds == null || !questLineIds.SequenceEqual(dbCampaign.QuestLineIds))
            {
                dbCampaign.QuestLineIds = questLineIds;
            }
        }

        _timer.AddPoint("Campaigns");
    }

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
            dbRace.Bit = dumpRace.PlayableRaceBit;
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
            dbCurrency.RechargeAmount = currency.RechargingAmountPerCycle;
            dbCurrency.RechargeInterval = currency.RechargingCycleDurationMS;
            dbCurrency.TransferPercent = (short)currency.WarbondTransferPercentage;
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

            dbReputation.AccountWide = (faction.Flags & 0x4) == 0x4;
            dbReputation.Expansion = faction.Expansion;
            dbReputation.ParagonId = faction.ParagonFactionID;
            dbReputation.ParentId = faction.ParentFactionID;
            dbReputation.RenownCurrencyId = faction.RenownCurrencyID;
            dbReputation.TierId = faction.FriendshipRepID;

            if (dbReputation.BaseValues == null || !dbReputation.BaseValues.SequenceEqual(faction.ReputationBases))
            {
                dbReputation.BaseValues = faction.ReputationBases;
            }

            if (dbReputation.MaxValues == null || !dbReputation.MaxValues.SequenceEqual(faction.ReputationMaxes))
            {
                dbReputation.MaxValues = faction.ReputationMaxes;
            }
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

    private async Task ImportGlobalStrings(WowDbContext context)
    {
        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowExpansion ||
                         ls.Type == StringType.WowInventorySlot ||
                         ls.Type == StringType.WowInventoryType)
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

        foreach (var language in _languages)
        {
            foreach ((string key, string value) in _globalStringMap[language]
                         .Where(kvp => kvp.Key.StartsWith("EXPANSION_NAME")))
            {
                int expansionId = int.Parse(key.Replace("EXPANSION_NAME", ""));
                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowExpansion, expansionId, value);
            }

            foreach ((string key, int slotId) in InventorySlotMap)
            {
                if (!_globalStringMap[language].TryGetValue(key, out string? value))
                {
                    ToolContext.Logger.Warning("Missing globalstrings key: {key}", key);
                    continue;
                }

                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowInventorySlot, slotId, value);
            }

            foreach ((string key, int slotId) in InventoryTypeMap)
            {
                if (!_globalStringMap[language].TryGetValue(key, out string? value))
                {
                    ToolContext.Logger.Warning("Missing globalstrings key: {key}", key);
                    continue;
                }

                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowInventoryType, slotId, value);
            }
        }

        _timer.AddPoint("GlobalStrings");
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

            int[] validDates = holiday.Dates.Where(date => date > 0).ToArray();
            if (validDates.Length == 1)
            {
                dbHoliday.StartDates = new();
                var startDate = DateTimeUtilities.ParseBlizzardDateTime(holiday.Dates[0]);
                // A year mask of 11111 (31) is "every year on this date"
                if (startDate.Year == 2031)
                {
                    for (int year = 2020; year < 2031; year++)
                    {
                        dbHoliday.StartDates.Add(startDate.AddYears(year - startDate.Year));
                    }
                }
                else
                {
                    dbHoliday.StartDates.Add(startDate);
                }
            }
            else
            {
                dbHoliday.StartDates = validDates
                    .Select(DateTimeUtilities.ParseBlizzardDateTime)
                    .Order()
                    .ToList();
            }
        }

        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowHolidayName)
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

        foreach (var language in _languages)
        {
            var nameMap = (await DataUtilities.LoadDumpCsvAsync<DumpHolidayNames>("holidaynames", language))
                .ToDictionary(dhn => dhn.ID, dhn => dhn.Name);

            foreach (var holiday in holidays)
            {
                if (!nameMap.TryGetValue(holiday.HolidayNameID, out string? holidayName))
                {
                    // ToolContext.Logger.Warning("No holiday name for {holidayId} {nameId}",
                    //     holiday.ID, holiday.HolidayNameID);
                    continue;
                }

                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowHolidayName, holiday.ID, holidayName);
            }
        }

        _timer.AddPoint("Holidays");
    }

    private async Task ImportInstances(WowDbContext context)
    {
        var instances = await DataUtilities
            .LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");

        var dbInstanceMap = await context.WowJournalInstance
            .ToDictionaryAsync(ji => ji.Id);

        foreach (var instance in instances)
        {
            if (!dbInstanceMap.TryGetValue(instance.ID, out var dbInstance))
            {
                dbInstance = dbInstanceMap[instance.ID] = new WowJournalInstance
                {
                    Id = instance.ID,
                    Flags = instance.Flags,
                    MapId = instance.MapID,
                };
                context.WowJournalInstance.Add(dbInstance);
            }

            dbInstance.Flags = instance.Flags;
            dbInstance.MapId = instance.MapID;
        }

        foreach (var language in _languages)
        {
            var maps = await DataUtilities
                .LoadDumpToDictionaryAsync<int, DumpMap>("map", map => map.ID);

            var dbLanguageMap = await context.LanguageString
                .AsNoTracking()
                .Where(ls => ls.Language == language &&
                             (ls.Type == StringType.WowJournalInstanceName || ls.Type == StringType.WowJournalInstanceMapName))
                .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

            foreach (var instance in instances)
            {

                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowJournalInstanceName,
                    instance.ID, instance.Name);

                if (maps.TryGetValue(instance.MapID, out var map))
                {
                    CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowJournalInstanceMapName,
                        instance.ID, map.Name);
                }
            }
        }

        _timer.AddPoint("Instances");
    }

    private async Task ImportItems(WowDbContext context)
    {
        var items = await DataUtilities.LoadDumpCsvAsync<DumpItem>("item");

        var baseItemSparseMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>("itemsparse"))
            .ToDictionary(itemSparse => itemSparse.ID);

        _itemMap = await context.WowItem.ToDictionaryAsync(item => item.Id);

        _timer.AddPoint("Items:Load");

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
            dbItem.LimitCategory = itemSparse.LimitCategory;
            dbItem.OppositeFactionId = itemSparse.OppositeFactionItemID;
            dbItem.Quality = (WowQuality)itemSparse.OverallQualityID;
            dbItem.RaceMask = itemSparse.AllowableRace;
            dbItem.RequiredAbility = itemSparse.RequiredAbility;
            dbItem.RequiredLevel = itemSparse.RequiredLevel;
            dbItem.RequiredSkill = itemSparse.RequiredSkill;
            dbItem.RequiredSkillRank = itemSparse.RequiredSkillRank;
            dbItem.Stackable = itemSparse.Stackable;
            dbItem.Unique = (short)(itemSparse.MaxCount & 0x7FFF);

            dbItem.Sockets = itemSparse.SocketTypes.Where(socketType => socketType > 0).ToArray();

            dbItem.CompletesQuestIds = _completeQuestByItemId.GetValueOrDefault(item.ID, []).ToArray();
            dbItem.TeachesSpellIds = _teachSpellByItemId.GetValueOrDefault(item.ID, []).ToArray();
            dbItem.TeachesTransmogSetIds = _teachTransmogSetByItemId.GetValueOrDefault(item.ID, []).ToArray();

            // Flags
            if (itemSparse.ItemNameDescriptionID is 1641 or 13932 or 14101)
            {
                dbItem.Flags |= WowItemFlags.LookingForRaidDifficulty;
            }
            if (itemSparse.Flags1.HasFlag(WowItemFlags1.HeroicTooltip) ||
                itemSparse.ItemNameDescriptionID == 2015)
            {
                dbItem.Flags |= WowItemFlags.HeroicDifficulty;
            }
            if (itemSparse.ItemNameDescriptionID == 13145)
            {
                dbItem.Flags |= WowItemFlags.MythicDifficulty;
            }
            if (itemSparse.Flags2.HasFlag(WowItemFlags2.AllianceOnly))
            {
                dbItem.Flags |= WowItemFlags.AllianceOnly;
            }
            if (itemSparse.Flags2.HasFlag(WowItemFlags2.HordeOnly))
            {
                dbItem.Flags |= WowItemFlags.HordeOnly;
            }
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

            dbItem.PrimaryStat = WowStat.None;
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

            dbItem.CraftingQuality = item.CraftingQualityID;
            dbItem.InventoryType = item.InventoryType;

            if (Hardcoded.ItemClassOverride.TryGetValue(item.ID, out var classTuple))
            {
                dbItem.ClassId = (short)classTuple.Item1;
                dbItem.SubclassId = (short)classTuple.Item2;
            }
            else if (dbItem.ClassId == (int)GameItemClass.Armor)
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
                    dbItem.ClassId = (int)GameItemClass.Weapon;
                    dbItem.SubclassId = (int)WowWeaponSubclass.Shield;
                }
                // Off-hand
                else if (subClass == WowArmorSubclass.Miscellaneous &&
                         dbItem.InventoryType == WowInventoryType.HeldInOffHand)
                {
                    dbItem.ClassId = (int)GameItemClass.Weapon;
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

        _timer.AddPoint("Items:Process");

        foreach (var language in _languages)
        {
            await ImportItemStrings(context, language);
        }

        _timer.AddPoint("Items:Strings");
    }

    private async Task ImportItemStrings(WowDbContext context, Language language)
    {
        var itemSparses = await DataUtilities.LoadDumpCsvAsync<DumpItemSparseName>("itemsparse", language);

        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == language && ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

        foreach (var itemSparse in itemSparses)
        {
            CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowItemName, itemSparse.ID, itemSparse.Name);
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

    private async Task ImportItemClasses(WowDbContext context)
    {
        var classes = await DataUtilities.LoadDumpCsvAsync<DumpItemClass>("itemclass");
        var classMap = await context.WowItemClass.ToDictionaryAsync(wic => wic.Id);

        foreach (var dumpItemClass in classes)
        {
            if (!classMap.TryGetValue(dumpItemClass.ID, out var dbItemClass))
            {
                dbItemClass = classMap[dumpItemClass.ID] = new WowItemClass()
                {
                    Id = dumpItemClass.ID,
                };
                context.WowItemClass.Add(dbItemClass);
            }

            dbItemClass.ClassId = dumpItemClass.ClassID;
        }

        var subClasses = await DataUtilities.LoadDumpCsvAsync<DumpItemSubclass>("itemsubclass");
        var subClassMap = await context.WowItemSubclass.ToDictionaryAsync(wic => wic.Id);

        foreach (var dumpItemSubclass in subClasses)
        {
            if (!subClassMap.TryGetValue(dumpItemSubclass.ID, out var dbItemSubclass))
            {
                dbItemSubclass = subClassMap[dumpItemSubclass.ID] = new WowItemSubclass()
                {
                    Id = dumpItemSubclass.ID,
                };
                context.WowItemSubclass.Add(dbItemSubclass);
            }

            dbItemSubclass.AuctionHouseSortOrder = dumpItemSubclass.AuctionHouseSortOrder;
            dbItemSubclass.ClassId = dumpItemSubclass.ClassID;
            dbItemSubclass.SubclassId = dumpItemSubclass.SubClassID;
        }

        _timer.AddPoint("ItemClasses");
    }

    private async Task ImportItemEffects(WowDbContext context)
    {
        var itemEffectToItems = (await DataUtilities.LoadDumpCsvAsync<DumpItemXItemEffect>("itemxitemeffect"))
            .ToGroupedDictionary(ixie => ixie.ItemEffectID);

        var itemEffects = await DataUtilities.LoadDumpCsvAsync<DumpItemEffect>("itemeffect");

        var spellEffectMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellEffect>("spelleffect"))
            .ToGroupedDictionary(se => se.SpellID);

        var newMap = new Dictionary<int, WowItemEffectV2>();
        foreach (var dumpItemEffect in itemEffects)
        {
            if (dumpItemEffect.TriggerType is 0 or 1) // On Use
            {
                if (!spellEffectMap.TryGetValue(dumpItemEffect.SpellID, out var spellEffects))
                {
                    // ToolContext.Logger.Information("No spell effects? ItemEffect {ie}", dumpItemEffect.ID);
                    continue;
                }

                foreach (var spellEffect in spellEffects)
                {
                    // if (!Enum.IsDefined(typeof(WowSpellEffectEffect), spellEffect.Effect))
                    // {
                    //     ToolContext.Logger.Information("Unknown spell effect type: {effect}", spellEffect.Effect);
                    //     continue;
                    // }

                    // If this item effect isn't attached to any items, make up a fake one
                    if (!itemEffectToItems.TryGetValue(dumpItemEffect.ID, out var itemXItemEffects))
                    {
                        itemXItemEffects = [
                            new DumpItemXItemEffect
                            {
                                ID = 10_000_000 + dumpItemEffect.ID,
                                ItemEffectID = dumpItemEffect.ID,
                                ItemID = 10_000_000 + dumpItemEffect.ID,
                            },
                        ];
                    }

                    foreach (var itemXItemEffect in itemXItemEffects)
                    {
                        if (!newMap.TryGetValue(itemXItemEffect.ItemID, out var newItemEffect))
                        {
                            newItemEffect = newMap[itemXItemEffect.ItemID] = new()
                            {
                                ItemId = itemXItemEffect.ItemID,
                            };
                        }

                        newItemEffect.ItemEffectIds.Add(itemXItemEffect.ItemEffectID);

                        if (!newItemEffect.SpellEffects.TryGetValue(spellEffect.SpellID, out var newSpellEffects))
                        {
                            newSpellEffects = newItemEffect.SpellEffects[spellEffect.SpellID] = new();
                        }

                        var newSpellEffect = newSpellEffects[spellEffect.EffectIndex] = new()
                        {
                            Effect = (WowSpellEffectEffect)spellEffect.Effect,
                            Values = [ spellEffect.EffectMiscValue0, spellEffect.EffectMiscValue1 ],
                        };

                        if (newSpellEffect.Effect == WowSpellEffectEffect.LearnSpell && spellEffect.EffectTriggerSpell > 0)
                        {
                            _teachSpellByItemId.GetOrNew(itemXItemEffect.ItemID).Add(spellEffect.EffectTriggerSpell);
                            _teachSpellBySpellId.GetOrNew(spellEffect.EffectTriggerSpell).Add(itemXItemEffect.ItemID);
                        }
                        else if (newSpellEffect.Effect == WowSpellEffectEffect.CompleteQuest && newSpellEffect.Values[0] > 0)
                        {
                            _completeQuestByItemId.GetOrNew(itemXItemEffect.ItemID).Add(newSpellEffect.Values[0]);
                        }
                        else if (newSpellEffect.Effect == WowSpellEffectEffect.LearnTransmogSet &&
                                 newSpellEffect.Values[0] > 0)
                        {
                            _teachTransmogSetByItemId.GetOrNew(itemXItemEffect.ItemID).Add(newSpellEffect.Values[0]);
                        }
                    }
                }
            }
            else if (dumpItemEffect.TriggerType == 6) // On Learn
            {
                if (!itemEffectToItems.TryGetValue(dumpItemEffect.ID, out var itemXItemEffects))
                {
                    ToolContext.Logger.Warning("ItemEffect {effect} has an On Learn trigger but no items??", dumpItemEffect.ID);
                    continue;
                }

                foreach (var itemXItemEffect in itemXItemEffects)
                {
                    if (!newMap.TryGetValue(itemXItemEffect.ItemID, out var newItemEffect))
                    {
                        newItemEffect = newMap[itemXItemEffect.ItemID] = new()
                        {
                            ItemId = itemXItemEffect.ItemID,
                        };
                    }

                    newItemEffect.ItemEffectIds.Add(itemXItemEffect.ItemEffectID);

                    if (!newItemEffect.SpellEffects.TryGetValue(dumpItemEffect.SpellID, out var newSpellEffects))
                    {
                        newSpellEffects = newItemEffect.SpellEffects[dumpItemEffect.SpellID] = new();
                    }

                    int effectIndex = 100;
                    while (newSpellEffects.ContainsKey(effectIndex))
                    {
                        effectIndex++;
                    }

                    newSpellEffects[effectIndex] = new()
                    {
                        Effect = WowSpellEffectEffect.LearnSpell,
                        Values = new[]
                        {
                            dumpItemEffect.SpellID,
                        },
                    };

                    _teachSpellByItemId.GetOrNew(itemXItemEffect.ItemID).Add(dumpItemEffect.SpellID);
                    _teachSpellBySpellId.GetOrNew(dumpItemEffect.SpellID).Add(itemXItemEffect.ItemID);
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
                var itemEffectIds = newEffect.ItemEffectIds.Distinct().Order().ToList();
                if (dbEffect.ItemEffectIds == null || !itemEffectIds.SequenceEqual(dbEffect.ItemEffectIds))
                {
                    dbEffect.ItemEffectIds = itemEffectIds;
                }

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
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

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

            dbMount.ItemIds = _teachSpellBySpellId!.GetValueOrDefault(dbMount.SpellId, []);
        }

        foreach (var dbMount in dbMountMap.Values)
        {
            dbMount.ItemIds ??= [];
        }

        foreach (var language in _languages)
        {
            var languageMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>("mount", language);
            foreach (var mount in languageMounts)
            {
                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowMountName, mount.ID, mount.Name);
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

            dbPet.ItemIds = _teachSpellBySpellId!.GetValueOrDefault(dbPet.SpellId, []);
        }

        foreach (var dbPet in dbPetMap.Values)
        {
            dbPet.ItemIds ??= [];
        }

        _timer.AddPoint("Pets");
    }

    private async Task ImportQuestLines(WowDbContext context)
    {
        var questLineXQuests = await DataUtilities.LoadDumpCsvAsync<DumpQuestLineXQuest>("questlinexquest");

        var questsByQuestLine = questLineXQuests
            .GroupBy(q => q.QuestLineID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Where(ql => (ql.Flags & 0x1) == 0) // IgnoreForCompletion
                    .OrderBy(ql => ql.OrderIndex)
                    .Select(ql => ql.QuestID)
                    .ToList()
            );

        var dbQuestLineMap = await context.WowQuestLine
            .ToDictionaryAsync(ql => ql.Id);

        var existingQuestIds = (await context.WowQuest
                .AsNoTracking()
                .Select(q => q.Id)
                .ToArrayAsync())
            .ToHashSet();

        foreach ((int questLineId, var questIds) in questsByQuestLine)
        {
            if (!dbQuestLineMap.TryGetValue(questLineId, out var dbQuestLine))
            {
                dbQuestLine = new WowQuestLine(questLineId);
                context.WowQuestLine.Add(dbQuestLine);
            }

            if (dbQuestLine.QuestIds == null || !questIds.SequenceEqual(dbQuestLine.QuestIds))
            {
                dbQuestLine.QuestIds = questIds;
            }

            foreach (int questId in questIds)
            {
                if (!existingQuestIds.Contains(questId))
                {
                    context.Add(new WowQuest(questId));
                    existingQuestIds.Add(questId);
                }
            }
        }

        _timer.AddPoint("QuestLines");
    }

    private async Task ImportCampaign(WowDbContext context)
    {
        var campaignXQuestLines = await DataUtilities
            .LoadDumpCsvAsync<DumpCampaignXQuestLine>("campaignxquestline");

        var questLinesByCampaign = campaignXQuestLines
            .GroupBy(q => q.CampaignID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(ql => ql.OrderIndex)
                    .Select(ql => ql.QuestLineID)
                    .ToList()
            );

        var dbCampaignMap = await context.WowCampaign
            .ToDictionaryAsync(campaign => campaign.Id);

        foreach ((int campaignId, var questLineIds) in questLinesByCampaign)
        {
            if (!dbCampaignMap.TryGetValue(campaignId, out var dbCampaign))
            {
                dbCampaign = new WowCampaign(campaignId);
                context.WowCampaign.Add(dbCampaign);
            }

            if (dbCampaign.QuestLineIds == null || !questLineIds.SequenceEqual(dbCampaign.QuestLineIds))
            {
                dbCampaign.QuestLineIds = questLineIds;
            }
        }

        _timer.AddPoint("Campaigns");
    }

    private async Task ImportRecipeItems(WowDbContext context)
    {
        var dbRecipeMap = await context.WowProfessionRecipeItem
            .ToDictionaryAsync(wpri => (wpri.SkillLineAbilityId, wpri.ItemId));

        var skillLineAbilities = await DataUtilities.LoadDumpCsvAsync<DumpSkillLineAbility>("skilllineability");

        var seen = new HashSet<(int, int)>();
        foreach (var skillLineAbility in skillLineAbilities)
        {
            if (skillLineAbility.Spell == 0 || !_teachSpellBySpellId.TryGetValue(skillLineAbility.Spell, out var recipeItemIds))
            {
                continue;
            }

            foreach (int recipeItemId in recipeItemIds)
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

        // TODO deletes

        _timer.AddPoint("RecipeItems");
    }

    private async Task ImportReputationTiers(WowDbContext context)
    {
        var dbLanguageMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowReputationTier)
            .ToDictionaryAsync(ls => (ls.Language, ls.Type, ls.Id));

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
            string basicString = string.Join(
                '|',
                _globalStringMap[language]
                    .Where(kvp => kvp.Key.StartsWith("FACTION_STANDING_LABEL") && kvp.Key.Length == 23)
                    .OrderBy(kvp => kvp.Key)
                    .Select(kvp => kvp.Value)
            );
            CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowReputationTier, 0, basicString);
            // End hack

            foreach ((int tierId, var tiers) in groupedTiers)
            {
                string tierString = string.Join('|', tiers.Select(tier => tier.Reaction));
                CreateOrUpdateString(context, dbLanguageMap, language, StringType.WowReputationTier, tierId, tierString);
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

            // Limit the class mask to valid classes to filter out weird stuff like 14/Adventurer
            dbSet.ClassMask = transmogSet.ClassMask & 0b1_1111_1111_1111;
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

    private async Task ImportWorldQuests(WowDbContext context)
    {
        var contentTuningMap = await DataUtilities.LoadDumpToDictionaryAsync<int, DumpContentTuning>(
            "contenttuning", ct => ct.ID, skipValidation: true);
        var modifierTreeMap = await DataUtilities.LoadDumpToDictionaryAsync<int, DumpModifierTree>(
            "modifiertree", mt => mt.ID);
        var playerConditionMap = await DataUtilities.LoadDumpToDictionaryAsync<int, DumpPlayerCondition>(
            "playercondition", pc => pc.ID);
        var questInfoMap = await DataUtilities.LoadDumpToDictionaryAsync<int, DumpQuestInfo>(
            "questinfo", qi => qi.ID,
            validFunc: qi => qi.Name.Contains("World Quest") || qi.ID == 281);

        var modifierTreeByParent = modifierTreeMap.Values
            .Where(mt => mt.Parent > 0)
            .ToGroupedDictionary(mt => mt.Parent);

        var dbQuestMap = await context.WowWorldQuest
            .ToDictionaryAsync(wq => wq.Id);

        var characterRaces = await context.WowCharacterRace.ToArrayAsync();
        var allianceArray = new BitArray(63);
        var hordeArray = new BitArray(63);
        foreach (var characterRace in characterRaces)
        {
            if (characterRace.Faction == WowFaction.Alliance)
            {
                allianceArray.Set(characterRace.Bit, true);
            }
            else if (characterRace.Faction == WowFaction.Horde)
            {
                hordeArray.Set(characterRace.Bit, true);
            }
        }

        ulong allianceMask = allianceArray.ToUInt64();
        ulong hordeMask = hordeArray.ToUInt64();

        var questV2s = await DataUtilities.LoadDumpCsvAsync<DumpQuestV2CliTask>("questv2clitask");
        foreach (var questV2 in questV2s)
        {
            if (!contentTuningMap.TryGetValue(questV2.ContentTuningID, out var contentTuning) ||
                contentTuning.ExpansionID <= 0 ||
                !questInfoMap.ContainsKey(questV2.QuestInfoID)
            )
            {
                continue;
            }

            if (!dbQuestMap.TryGetValue(questV2.ID, out var dbQuest))
            {
                dbQuest = dbQuestMap[questV2.ID] = new WowWorldQuest(questV2.ID);
                context.WowWorldQuest.Add(dbQuest);
            }

            dbQuest.Expansion = contentTuning.ExpansionID;
            dbQuest.MaxLevel = contentTuning.MaxLevel ?? contentTuning.LfgMaxLevel ?? 0;
            dbQuest.MinLevel = contentTuning.MinLevel ?? contentTuning.LfgMinLevel ?? 0;
            dbQuest.QuestInfoId = questV2.QuestInfoID;

            dbQuest.Faction = WowFaction.Neutral;
            if (questV2.FiltRaces != -1)
            {
                ulong raceMask = (ulong)questV2.FiltRaces;
                bool allianceMatch = (raceMask & allianceMask) > 0;
                bool hordeMatch = (raceMask & hordeMask) > 0;
                if (allianceMatch && !hordeMatch)
                {
                    dbQuest.Faction = WowFaction.Alliance;
                }
                else if (!allianceMatch && hordeMatch)
                {
                    dbQuest.Faction = WowFaction.Horde;
                }
            }

            dbQuest.NeedQuestIds = new();
            dbQuest.SkipQuestIds = new();

            if (playerConditionMap.TryGetValue(questV2.ConditionID, out var playerCondition) &&
                modifierTreeByParent.TryGetValue(playerCondition.ModifierTreeID, out var modifierTrees))
            {
                foreach (var modifierTree in modifierTrees)
                {
                    // Operator=SingleTrue and Type=REWARDED_QUEST
                    if (modifierTree.Operator == 2 && modifierTree.Type == 110)
                    {
                        dbQuest.NeedQuestIds.Add(modifierTree.Asset);
                    }
                }
            }

            if (questV2.FiltCompletedQuestLogic > 0)
            {
                ToolContext.Logger.Information("quest={quest} logic={cond} cond0={c0} cond1={c2} cond2={c2}",
                    questV2.ID, questV2.FiltCompletedQuestLogic, questV2.FiltCompletedQuest0,
                    questV2.FiltCompletedQuest1, questV2.FiltCompletedQuest2);
            }

            // contentTuning.ExpansionID, MinLevel?, MaxLevel?
        }

        _timer.AddPoint("WorldQuests");
    }
}
