using Serilog.Context;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Covenants;
using Wowthing.Tool.Models.Heirlooms;
using Wowthing.Tool.Models.Journal;
using Wowthing.Tool.Models.Professions;
using Wowthing.Tool.Models.Static;
using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Tools;

public class StaticTool
{
    private JankTimer _timer = new();

    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<int, WowMount> _mountMap;
    private Dictionary<int, WowPet> _petMap;
    private Dictionary<int, WowToy> _toyMap;

    private Dictionary<int, Dictionary<short, int>> _itemToAppearance;

    private Dictionary<(StringType Type, Language Language, int Id), string> _stringMap;

    private static readonly StringType[] StringTypes = {
        StringType.WowCharacterClassName,
        StringType.WowCharacterRaceName,
        StringType.WowCharacterSpecializationName,
        StringType.WowCharacterTitle,
        StringType.WowCreatureName,
        StringType.WowCurrencyName,
        StringType.WowCurrencyCategoryName,
        StringType.WowHolidayName,
        StringType.WowInventorySlot,
        StringType.WowInventoryType,
        StringType.WowItemName,
        StringType.WowKeystoneAffixName,
        StringType.WowMountName,
        StringType.WowQuestName,
        StringType.WowReputationDescription,
        StringType.WowReputationName,
        StringType.WowReputationTier,
        StringType.WowSoulbindName,
        StringType.WowSkillLineName,
        StringType.WowSpellItemEnchantmentName,
    };

    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Static");
        await using var context = ToolContext.GetDbContext();

        var db = ToolContext.Redis.GetDatabase();
        var cacheData = new RedisStaticData();

        ToolContext.Logger.Information("Loading data...");

        // Bulk data
        _itemMap = await context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

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

        _stringMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => StringTypes.Contains(ls.Type))
            .ToDictionaryAsync(
                ls => (ls.Type, ls.Language, ls.Id),
                ls => ls.String
            );

        var itemModifiedAppearances = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();
        _itemToAppearance = itemModifiedAppearances
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

        // Bags
        cacheData.RawBags = _itemMap.Values
            .Where(item => item.ContainerSlots > 0)
            .Select(item => new List<int> { item.Id, (int)item.Quality, item.ContainerSlots })
            .ToList();

        // Character stuff
        cacheData.CharacterClasses = await context.WowCharacterClass
            .AsNoTracking()
            .OrderBy(cls => cls.Id)
            .ToDictionaryAsync(
                cls => cls.Id,
                cls => new StaticCharacterClass(cls)
            );

        cacheData.CharacterRaces = await context.WowCharacterRace
            .AsNoTracking()
            .OrderBy(race => race.Id)
            .ToDictionaryAsync(
                race => race.Id,
                race => new StaticCharacterRace(race)
                {
                    Slug = GetString(StringType.WowCharacterRaceName, Language.enUS, race.Id).Slugify(),
                }
            );

        cacheData.CharacterSpecializations = await context.WowCharacterSpecialization
            .AsNoTracking()
            .Where(spec => spec.Order < 4)
            .OrderBy(spec => spec.Id)
            .ToDictionaryAsync(
                spec => spec.Id,
                spec => new StaticCharacterSpecialization(spec)
            );

        // Currencies
        cacheData.RawCurrencies = await context.WowCurrency
            .AsNoTracking()
            .Where(currency => !Hardcoded.IgnoredCurrencies.Contains(currency.Id))
            .OrderBy(currency => currency.Id)
            .Select(currency => new StaticCurrency(currency))
            .ToArrayAsync();

        cacheData.RawCurrencyCategories = await context.WowCurrencyCategory
            .AsNoTracking()
            .OrderBy(category => category.Id)
            .Select(category => new StaticCurrencyCategory(category))
            .ToArrayAsync();

        foreach (var category in cacheData.RawCurrencyCategories)
        {
            category.Slug = GetString(StringType.WowCurrencyCategoryName, Language.enUS, category.Id).Slugify();
        }

        _timer.AddPoint("Currencies");

        // Heirlooms
        cacheData.Heirlooms = await LoadHeirlooms();
        _timer.AddPoint("Heirlooms");

        // Holidays
        cacheData.RawHolidays = await context.WowHoliday
            .Where(holiday => holiday.Region == 0 || (holiday.Region & 31) != 0)
            .OrderBy(holiday => holiday.Id)
            .Select(holiday => new StaticHoliday(holiday))
            .ToArrayAsync();

        cacheData.HolidayIds = new()
        {
            { "holidayArena", new() },
            { "holidayBattlegrounds", new() },
            { "holidayDungeons", new() },
            { "holidayPetPvp", new() },
            { "holidayTimewalking", new() },
            { "holidayTimewalkingItem", new() },
            { "holidayWorldQuests", new() },
            { "pvpBrawl", new() },
        };

        foreach (var holiday in cacheData.RawHolidays)
        {
            string holidayName = GetString(StringType.WowHolidayName, Language.enUS, holiday.Id);
            if (holidayName == "Arena Skirmish Bonus Event")
            {
                cacheData.HolidayIds["holidayArena"].Add(holiday.Id);
            }
            else if (holidayName == "Battleground Bonus Event")
            {
                cacheData.HolidayIds["holidayBattlegrounds"].Add(holiday.Id);
            }
            else if (holidayName == "Pet Battle Bonus Event")
            {
                cacheData.HolidayIds["holidayPetPvp"].Add(holiday.Id);
            }
            else if (holidayName == "Timewalking Dungeon Event")
            {
                cacheData.HolidayIds["holidayTimewalking"].Add(holiday.Id);
                cacheData.HolidayIds["holidayTimewalkingItem"].Add(holiday.Id);
            }
            else if (holidayName == "World Quest Bonus Event")
            {
                cacheData.HolidayIds["holidayWorldQuests"].Add(holiday.Id);
            }
            else if (holidayName.StartsWith("PvP Brawl"))
            {
                cacheData.HolidayIds["pvpBrawl"].Add(holiday.Id);
            }
            else if (holidayName.EndsWith("Dungeon Event"))
            {
                cacheData.HolidayIds["holidayDungeons"].Add(holiday.Id);
            }
        }

        _timer.AddPoint("Holidays");

        // Illusions
        cacheData.Illusions = await LoadIllusions();
        _timer.AddPoint("Illusions");

        // Instances
        cacheData.InstancesRaw = await LoadInstances();
        _timer.AddPoint("Instances");

        // Keystone Affixes
        var affixMaps = _stringMap
            .Where(kvp => kvp.Key.Type == StringType.WowKeystoneAffixName)
            .GroupBy(kvp => kvp.Key.Language)
            .ToDictionary(
                group => group.Key,
                group => group.ToDictionary(
                    kvp => kvp.Key.Id,
                    kvp => kvp.Value
            ));
        cacheData.KeystoneAffixes = affixMaps[Language.enUS]
            .Select(kvp => new StaticKeystoneAffix(kvp.Key, kvp.Value))
            .ToDictionary(ska => ska.Id);

        // Professions
        var professions = await LoadProfessions();
        _timer.AddPoint("Professions");

        // Reputations
        var reputations = await context.WowReputation
            .AsNoTracking()
            .OrderBy(rep => rep.Id)
            .ToArrayAsync();

        cacheData.RawReputationSets = LoadReputationSets();
        _timer.AddPoint("Reputations");

        // Soulbinds
        var soulbinds = await LoadSoulbinds();
        _timer.AddPoint("Soulbinds");

        // Talents
        //cacheData.Talents = await LoadTalents();
        _timer.AddPoint("Talents");

        // Basic database dumps
        cacheData.RawRealms = await context.WowRealm
            .AsNoTracking()
            .OrderBy(realm => realm.Id)
            .ToListAsync();

        cacheData.ReputationTiers = new SortedDictionary<int, StaticReputationTier>(
            await context.WowReputationTier
                .AsNoTracking()
                .ToDictionaryAsync(
                    tier => tier.Id,
                    tier => new StaticReputationTier(tier)
                )
        );

        _timer.AddPoint("Load");

        // Initial object creation
        cacheData.RawReputations = reputations.Select(rep => new StaticReputation(rep))
            .ToArray();

        cacheData.RawMounts = _mountMap
            .Values
            .OrderBy(mount => mount.Id)
            .Select(mount => new StaticMount(mount))
            .ToArray();

        cacheData.RawPets = _petMap
            .Values
            .OrderBy(pet => pet.Id)
            .Select(pet => new StaticPet(pet))
            .ToArray();

        cacheData.RawToys = _toyMap
            .Values
            .OrderBy(toy => toy.Id)
            .Select(toy => new StaticToy(toy))
            .ToArray();

        _timer.AddPoint("Objects");

        // Add anything that uses strings
        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {lang}...", language);

            cacheData.Professions = professions[language];
            cacheData.Soulbinds = soulbinds[language];

            cacheData.InventorySlots = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowInventorySlot && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.InventoryTypes = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowInventoryType && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.QuestNames = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowQuestName && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.Titles = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowCharacterTitle && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            foreach (var characterClass in cacheData.CharacterClasses.Values)
            {
                characterClass.Name = GetString(StringType.WowCharacterClassName, language, characterClass.Id);
            }

            foreach (var characterRace in cacheData.CharacterRaces.Values)
            {
                characterRace.Name = GetString(StringType.WowCharacterRaceName, language, characterRace.Id);
            }

            foreach (var characterSpec in cacheData.CharacterSpecializations.Values)
            {
                characterSpec.Name = GetString(StringType.WowCharacterSpecializationName, language, characterSpec.Id);
            }

            foreach (var illusion in cacheData.Illusions.Values)
            {
                illusion.Name = GetString(StringType.WowSpellItemEnchantmentName, language, illusion.EnchantmentId);
            }

            foreach (var keystoneAffix in cacheData.KeystoneAffixes.Values)
            {
                keystoneAffix.Name = affixMaps[language].GetValueOrDefault(keystoneAffix.Id, affixMaps[Language.enUS][keystoneAffix.Id]);
            }

            foreach (var currency in cacheData.RawCurrencies)
            {
                currency.Name = GetString(StringType.WowCurrencyName, language, currency.Id);
            }

            foreach (var currencyCategory in cacheData.RawCurrencyCategories)
            {
                currencyCategory.Name = GetString(StringType.WowCurrencyCategoryName, language, currencyCategory.Id);
            }

            foreach (var holiday in cacheData.RawHolidays)
            {
                holiday.Name = GetString(StringType.WowHolidayName, language, holiday.Id);
            }

            foreach (var reputation in cacheData.RawReputations)
            {
                reputation.Name = GetString(StringType.WowReputationName, language, reputation.Id);
                reputation.Description = GetString(StringType.WowReputationDescription, language, reputation.Id);
            }

            foreach (var mount in cacheData.RawMounts)
            {
                mount.Name = GetString(StringType.WowMountName, language, mount.Id);
            }

            foreach (var pet in cacheData.RawPets)
            {
                pet.Name = GetString(StringType.WowCreatureName, language, pet.CreatureId);
            }

            foreach (var toy in cacheData.RawToys)
            {
                toy.Name = GetString(StringType.WowItemName, language, toy.ItemId);
            }

            foreach (var reputationTier in cacheData.ReputationTiers.Values)
            {
                reputationTier.Names = GetString(StringType.WowReputationTier, language, reputationTier.Id)
                    .Split('|');
            }

            string cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"static-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache", true);

        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private string GetString(StringType type, Language language, int id)
    {
        if (!_stringMap.TryGetValue((type, language, id), out string languageName))
        {
            languageName = _stringMap.GetValueOrDefault(
                (type, Language.enUS, id), $"{type.ToString()} #{id}");
        }

        return languageName;
    }

    private List<StaticReputationCategory> LoadReputationSets()
    {
        var categories = new List<StaticReputationCategory>();

        var basePath = Path.Join(DataUtilities.DataPath, "reputations");
        foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
        {
            if (line == "-")
            {
                categories.Add(null);
            }
            else
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(DataUtilities.YamlDeserializer.Deserialize<StaticReputationCategory>(File.OpenText(filePath)));
            }
        }

        return categories;
    }

    private async Task<Dictionary<Language, Dictionary<int, OutProfession>>> LoadProfessions()
    {
        var itemNameToId = _stringMap
            .Where(kvp => kvp.Key is { Type: StringType.WowItemName, Language: Language.enUS })
            .GroupBy(kvp => kvp.Value)
            .ToDictionary(
                group => group.Key,
                group => group.MaxBy(kvp => kvp.Key.Id).Key.Id
            );

        var spellEffectMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellEffect>("spelleffect"))
            .ToGroupedDictionary(se => se.SpellID);

        var craftingDataMap = (await DataUtilities.LoadDumpCsvAsync<DumpCraftingData>("craftingdata"))
            .ToDictionary(cd => cd.ID, cd => cd.CraftedItemID);

        var skillLines = await DataUtilities.LoadDumpCsvAsync<DumpSkillLine>("skillline");

        var skillLineAbilities = await DataUtilities.LoadDumpCsvAsync<DumpSkillLineAbility>("skilllineability");

        var professions = skillLines
            .Where(line => Hardcoded.PrimaryProfessions.Contains(line.ID) ||
                           Hardcoded.SecondaryProfessions.Contains(line.ID))
            .ToArray();

        var subProfessions = skillLines
            .Where(line => (Hardcoded.PrimaryProfessions.Contains(line.ParentSkillLineID) ||
                            Hardcoded.SecondaryProfessions.Contains(line.ParentSkillLineID)) &&
                           !Hardcoded.IgnoredProfessions.Contains(line.ID))
            .ToGroupedDictionary(line => line.ParentSkillLineID);

        var supersededBy = skillLineAbilities
            .Where(sla => sla.SupercedesSpell > 0)
            .GroupBy(sla => sla.SupercedesSpell)
            .ToDictionary(
                group => group.Key,
                group => group.First()
            );

        var skillLineSpellIds = new HashSet<int>(skillLineAbilities.Select(ability => ability.Spell));
        var spellNameMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellName>(
                "spellname",
                validFunc: dsn => skillLineSpellIds.Contains(dsn.ID)
            ))
            .ToDictionary(dsn => dsn.ID, dsn => dsn.Name);

        var skillLineParentMap = skillLines
            .Where(line => line.ParentSkillLineID > 0)
            .ToDictionary(line => line.ID, line => line.ParentSkillLineID);

        var categoryAbilities = skillLineAbilities
            .GroupBy(sla => sla.TradeSkillCategoryID)
            .ToDictionary(
                group => group.Key,
                group => group.ToArray()
            );

        var allProfs = new HashSet<int>(Hardcoded.PrimaryProfessions
                .Concat(Hardcoded.SecondaryProfessions)
        );

        var ret = new Dictionary<Language, Dictionary<int, OutProfession>>();
        foreach (var language in Enum.GetValues<Language>())
        {
            var categories = await DataUtilities.LoadDumpCsvAsync<DumpTradeSkillCategory>(
                "tradeskillcategory",
                language,
                category => !Hardcoded.IgnoredTradeSkillCategories.Contains(category.ID)
            );

            var categoriesByProfession = categories
                .GroupBy(tsc => allProfs.Contains(tsc.SkillLineID)
                    ? tsc.SkillLineID
                    : skillLineParentMap.GetValueOrDefault(tsc.SkillLineID, 0))
                .ToDictionary(group => group.Key, group => group.ToList());

            var professionRootCategories = new Dictionary<int, List<OutProfessionCategory>>();
            foreach (int professionId in allProfs)
            {
                if (!categoriesByProfession.TryGetValue(professionId, out var professionCategories))
                {
                    ToolContext.Logger.Warning("No profession categories for profession {id}", professionId);
                    continue;
                }

                var categoryMap = new Dictionary<int, OutProfessionCategory>();
                foreach (var category in professionCategories)
                {
                    // Why is this the only wonky one
                    if (category.ID == 1293)
                    {
                        category.OrderIndex = 920;
                    }

                    var outCategory = categoryMap[category.ID] = new OutProfessionCategory(category);

                    var abilities = categoryAbilities
                        .GetValueOrDefault(category.ID, Array.Empty<DumpSkillLineAbility>())
                        .Where(ability => ability.SupercedesSpell == 0 &&
                                          !Hardcoded.IgnoredSkillLineAbilities.Contains(ability.Spell))
                        .OrderByDescending(ability => ability.MinSkillLineRank)
                        //.ThenByDescending(ability => ability.TrivialSkillLineRankLow)
                        .ThenByDescending(ability => ability.TrivialSkillLineRankHigh)
                        .ThenBy(ability => spellNameMap.GetValueOrDefault(ability.Spell, $"ZZZ"))
                        .ToArray();
                    foreach (var ability in abilities)
                    {
                        var outAbility = new OutProfessionAbility(
                            ability,
                            spellNameMap.GetValueOrDefault(ability.Spell, $"Spell #{ability.Spell}")
                        );

                        if (supersededBy.TryGetValue(ability.Spell, out var superAbility))
                        {
                            outAbility.Ranks = new();
                            while (superAbility != null)
                            {
                                outAbility.Ranks.Add(superAbility.ID);
                                outAbility.Ranks.Add(superAbility.Spell);
                                supersededBy.TryGetValue(superAbility.Spell, out superAbility);
                            }
                        }

                        if (spellEffectMap.TryGetValue(ability.Spell, out var abilityEffects))
                        {
                            foreach (var abilityEffect in abilityEffects)
                            {
                                if (abilityEffect.Effect == 288 &&
                                    craftingDataMap.TryGetValue(abilityEffect.EffectMiscValue0, out int effectItemId))
                                {
                                    outAbility.ItemId = effectItemId;
                                    break;
                                }
                            }
                        }

                        if (outAbility.ItemId == 0 && itemNameToId.TryGetValue(outAbility.Name, out int nameItemid))
                        {
                            outAbility.ItemId = nameItemid;
                        }

                        outCategory.Abilities.Add(outAbility);
                    }
                }

                var roots = new List<OutProfessionCategory>();
                foreach (var category in professionCategories)
                {
                    if (category.ParentTradeSkillCategoryID > 0)
                    {
                        categoryMap[category.ParentTradeSkillCategoryID].Children.Add(categoryMap[category.ID]);
                    }
                    else
                    {
                        roots.Add(categoryMap[category.ID]);
                    }
                }

                professionRootCategories[professionId] = roots
                    .OrderBy(opc => opc.Order)
                    .ToList();

                foreach (var opc in categoryMap.Values)
                {
                    opc.Children = opc.Children
                        .OrderBy(child => child.Order)
                        .ToList();
                }
            }

            ret[language] = professions
                .ToDictionary(
                    profession => profession.ID,
                    profession => new OutProfession
                    {
                        Id = profession.ID,
                        Name = GetString(StringType.WowSkillLineName, language, profession.ID),
                        Slug = GetString(StringType.WowSkillLineName, Language.enUS, profession.ID)
                            .Split('|')[0]
                            .Slugify(),
                        Type = Hardcoded.PrimaryProfessions.Contains(profession.ID) ? 0 : 1,
                        SubProfessions = subProfessions
                            .GetValueOrDefault(profession.ID)
                            .EmptyIfNull()
                            .OrderBy(line => line.ParentTierIndex)
                            .Select(line => new OutSubProfession
                            {
                                Id = line.ID,
                                Name = GetString(StringType.WowSkillLineName, language, line.ID),
                            })
                            .ToList(),
                        RawCategories = professionRootCategories.GetValueOrDefault(profession.ID),
                    }
                );
        }
        return ret;
    }

    private async Task<Dictionary<Language, Dictionary<int, List<OutSoulbind>>>> LoadSoulbinds()
    {
        // Load
        var soulbinds = await DataUtilities.LoadDumpCsvAsync<DumpSoulbind>("soulbind");

        var soulbindOrder = (await DataUtilities.LoadDumpCsvAsync<DumpSoulbindUiDisplayInfo>("soulbinduidisplayinfo"))
            .OrderBy(di => di.OrderIndex)
            .Select(di => di.SoulbindID)
            .ToArray();

        var talentTreeIds = new HashSet<int>(soulbinds.Select(soulbind => soulbind.GarrTalentTreeID));
        var talents = await DataUtilities.LoadDumpCsvAsync<DumpGarrTalent>(
            "garrtalent",
            validFunc: (talent) => talentTreeIds.Contains(talent.GarrTalentTreeID)
        );

        var talentIds = new HashSet<int>(talents.Select(talent => talent.ID));
        var talentSpellId = (await DataUtilities.LoadDumpCsvAsync<DumpGarrTalentRank>(
            "garrtalentrank",
            validFunc: rank => talentIds.Contains(rank.GarrTalentID)
        )).ToDictionary(
            rank => rank.GarrTalentID,
            rank => rank.PerkSpellID
        );

        // Mangle
        var soulbindsByCovenant = soulbinds
            .GroupBy(soulbind => soulbind.CovenantID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(soulbind => Array.IndexOf(soulbindOrder, soulbind.ID))
                    .ToList()
            );
        var talentsByTreeId = talents.ToGroupedDictionary(talent => talent.GarrTalentTreeID);

        // Process
        var ret = new Dictionary<Language, Dictionary<int, List<OutSoulbind>>>();

        foreach (var language in Enum.GetValues<Language>())
        {
            ret[language] = new Dictionary<int, List<OutSoulbind>>();

            foreach (var (covenantId, covenantSoulbinds) in soulbindsByCovenant)
            {
                var retCovenant = ret[language][covenantId] = new List<OutSoulbind>();

                foreach (var soulbind in covenantSoulbinds)
                {
                    retCovenant.Add(new OutSoulbind
                    {
                        Id = soulbind.ID,
                        Name = GetString(StringType.WowSoulbindName, language, soulbind.ID),
                        Renown = Hardcoded.SoulbindRenown[soulbind.ID],
                        Rows = talentsByTreeId[soulbind.GarrTalentTreeID]
                            .GroupBy(talent => talent.Tier)
                            .OrderBy(group => group.Key)
                            .Select(group => group
                                .OrderBy(talent => talent.UiOrder)
                                .Select(talent => new List<int>
                                {
                                    talent.UiOrder,
                                    talent.GarrTalentSocketPropertiesID > 0
                                        ? talent.GarrTalentSocketPropertiesID
                                        : talentSpellId[talent.ID],
                                })
                                .ToList()
                            )
                            .ToList()
                    });
                }
            }
        }

        return ret;
    }

    private static async Task<Dictionary<int, List<List<int>>>> LoadTalents()
    {
        var talents = await DataUtilities.LoadDumpCsvAsync<DumpTalent>("talent");

        // classId => { tierId => { column => talent } }
        var classTalents = talents
            .Where(talent => talent.ClassID > 0 && talent.SpecID == 0)
            .GroupBy(talent => talent.ClassID)
            .ToDictionary(
                classGroup => classGroup.Key,
                classGroup => classGroup
                    .GroupBy(talent => talent.TierID)
                    .ToDictionary(
                        tierGroup => tierGroup.Key,
                        tierGroup => tierGroup
                            .ToDictionary(talent => talent.ColumnIndex)
                    )
            );

        // specId => { tierId => { column => talent } }
        var specTalents = talents
            .Where(talent => talent.ClassID > 0 && talent.SpecID > 0)
            .GroupBy(talent => talent.SpecID)
            .ToDictionary(
                specGroup => specGroup.Key,
                specGroup => specGroup
                    .GroupBy(talent => talent.TierID)
                    .ToDictionary(
                        tierGroup => tierGroup.Key,
                        tierGroup => tierGroup
                            .ToDictionary(talent => talent.ColumnIndex)
                    )
            );

        // specId => classId
        var specToClass = talents
            .Where(talent => talent.ClassID > 0)
            .GroupBy(talent => talent.SpecID)
            .ToDictionary(
                specGroup => specGroup.Key,
                specGroup => specGroup.First().ClassID
            );

        var ret = new Dictionary<int, List<List<int>>>();
        foreach (var (specId, tiers) in specTalents)
        {
            var specData = new List<List<int>>();

            for (int tierIndex = 0; tierIndex <= 6; tierIndex++)
            {
                var tierData = new List<int>();
                tiers.TryGetValue(tierIndex, out var columns);

                for (int columnIndex = 0; columnIndex <= 2; columnIndex++)
                {
                    DumpTalent talent = null;
                    if (columns != null)
                    {
                        columns.TryGetValue(columnIndex, out talent);
                    }

                    if (talent == null)
                    {
                        classTalents[specToClass[specId]][tierIndex].TryGetValue(columnIndex, out talent);
                    }

                    tierData.Add(talent?.SpellID ?? 0);
                }

                specData.Add(tierData);
            }

            ret[specId] = specData;
        }

        return ret;
    }

    private async Task<Dictionary<int, int[]>> LoadHeirlooms()
    {
        var heirlooms = await DataUtilities.LoadDumpCsvAsync<DumpHeirloom>("heirloom");

        var arrays = new List<int[]>();
        var ret = new Dictionary<int, int[]>();

        foreach (var heirloom in heirlooms)
        {
            var bonusIds = heirloom.UpgradeBonusIDs.ToArray();
            var bonusIdsIndex = arrays.FindIndex((a) => a.SequenceEqual(bonusIds));
            if (bonusIdsIndex == -1)
            {
                arrays.Add(bonusIds);
                bonusIdsIndex = arrays.Count - 1;
                ret[bonusIdsIndex] = bonusIds;
            }

            var itemIds = heirloom.UpgradeItemIDs.ToArray();
            var itemIdsIndex = arrays.FindIndex((a) => a.SequenceEqual(itemIds));
            if (itemIdsIndex == -1)
            {
                arrays.Add(itemIds);
                itemIdsIndex = arrays.Count - 1;
                ret[itemIdsIndex] = itemIds;
            }

            ret.Add(heirloom.ItemID, new[] { bonusIdsIndex, itemIdsIndex });
        }

        return ret;
    }

    private async Task<Dictionary<int, StaticIllusion>> LoadIllusions()
    {
        return (await DataUtilities
            .LoadDumpCsvAsync<DumpTransmogIllusion>("transmogillusion"))
            .ToDictionary(
                illusion => illusion.ID,
                illusion => new StaticIllusion(illusion)
            );
    }

    private static readonly HashSet<int> InstanceTypes = new HashSet<int>() {
        1, // Party Dungeon
        2, // Raid Dungeon
    };
    private async Task<List<OutInstance>> LoadInstances()
    {
        var journalInstances = await DataUtilities
            .LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");
        var mapIdToInstanceId = journalInstances
            .GroupBy(instance => instance.MapID)
            .ToDictionary(
                k => k.Key,
                v => v.First().ID
            );

        var mapsById = (await DataUtilities.LoadDumpCsvAsync<DumpMap>("map"))
            .ToDictionary(map => map.ID);

        var sigh = new Dictionary<int, OutInstance>();
        foreach (var journalInstance in journalInstances)
        {
            if (mapsById.TryGetValue(journalInstance.MapID, out var map))
            {
                if (InstanceTypes.Contains(map.InstanceType))
                {
                    sigh.Add(journalInstance.ID, new OutInstance(map, journalInstance.ID));
                }
                else
                {
                    ToolContext.Logger.Warning("Invalid instance type for instance {InstanceId}: {Type}", journalInstance.ID, map.InstanceType);
                }
            }
            else
            {
                ToolContext.Logger.Warning("No mapsById entry for {InstanceId}??", journalInstance.ID);
            }
        }

        /*foreach (var map in maps.Where(m => mapIdToInstanceId.ContainsKey(m.ID) && InstanceTypes.Contains(m.InstanceType)))
        {
            if (mapIdToInstanceId.TryGetValue(map.ID, out int instanceId))
            {
                if (sigh.ContainsKey(instanceId))
                {
                    ToolContext.Logger.Information("DUPLICATE BULLSHIT: mapId={MapId} instanceId={InstanceId}", map.ID, instanceId);
                }
                else
                {
                    sigh.Add(instanceId, new OutInstance(map, instanceId));
                }
            }
            else
            {
                ToolContext.Logger.Information("No mapIdToInstanceId for {MapId}??", map.ID);
            }
        }*/
        return sigh.Values
            .OrderBy(instance => instance.Expansion)
            .ThenBy(instance => instance.Id)
            .ToList();
    }
}
