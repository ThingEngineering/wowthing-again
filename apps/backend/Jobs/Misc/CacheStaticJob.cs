using Wowthing.Backend.Data;
using Wowthing.Backend.Jobs.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Achievements;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Models.Static;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheStaticJob : JobBase, IScheduledJob
{
    private JankTimer _timer;

    private Dictionary<int, WowItem> _itemMap;
    private Dictionary<int, WowMount> _mountMap;
    private Dictionary<int, WowPet> _petMap;
    private Dictionary<int, WowToy> _toyMap;

    private Dictionary<int, Dictionary<short, int>> _itemToAppearance;

    private Dictionary<(StringType Type, Language Language, int Id), string> _stringMap;

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.CacheStatic,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 61,
    };

    public override async Task Run(params string[] data)
    {
        _timer = new JankTimer();

        await LoadData();
        await BuildStaticData();

        Logger.Information("{0}", _timer.ToString());
    }

    private static readonly StringType[] StringTypes = {
        StringType.WowCharacterClassName,
        StringType.WowCharacterRaceName,
        StringType.WowCharacterSpecializationName,
        StringType.WowCreatureName,
        StringType.WowCurrencyName,
        StringType.WowCurrencyCategoryName,
        StringType.WowItemName,
        StringType.WowMountName,
        StringType.WowReputationDescription,
        StringType.WowReputationName,
        StringType.WowSoulbindName,
        StringType.WowSkillLineName,
        StringType.WowSpellItemEnchantmentName,
    };
    private async Task LoadData()
    {
        _itemMap = await Context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

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

        var itemModifiedAppearances = await Context.WowItemModifiedAppearance
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

        _timer.AddPoint("Database");
    }

    #region Static data
    private async Task BuildStaticData()
    {
        var db = Redis.GetDatabase();
        var cacheData = new RedisStaticCache();

        // RaiderIO
        var raiderIoScoreTiers = await db.JsonGetAsync<Dictionary<int, OutRaiderIoScoreTiers>>(DataRaiderIoScoreTiersJob.CacheKey);
        cacheData.RaiderIoScoreTiers = raiderIoScoreTiers ?? new Dictionary<int, OutRaiderIoScoreTiers>();

        // Bags
        cacheData.RawBags = _itemMap.Values
            .Where(item => item.ContainerSlots > 0)
            .Select(item => new List<int> { item.Id, (int)item.Quality, item.ContainerSlots })
            .ToList();

        // Character stuff
        cacheData.CharacterClasses = await Context.WowCharacterClass
            .AsNoTracking()
            .OrderBy(cls => cls.Id)
            .ToDictionaryAsync(
                cls => cls.Id,
                cls => new StaticCharacterClass(cls)
            );

        cacheData.CharacterRaces = await Context.WowCharacterRace
            .AsNoTracking()
            .OrderBy(race => race.Id)
            .ToDictionaryAsync(
                race => race.Id,
                race => new StaticCharacterRace(race)
            );

        cacheData.CharacterSpecializations = await Context.WowCharacterSpecialization
            .AsNoTracking()
            .Where(spec => spec.Order < 4)
            .OrderBy(spec => spec.Id)
            .ToDictionaryAsync(
                spec => spec.Id,
                spec => new StaticCharacterSpecialization(spec)
            );

        // Currencies
        cacheData.RawCurrencies = await Context.WowCurrency
            .AsNoTracking()
            .Where(currency => !Hardcoded.IgnoredCurrencies.Contains(currency.Id))
            .OrderBy(currency => currency.Id)
            .Select(currency => new StaticCurrency(currency))
            .ToArrayAsync();

        cacheData.RawCurrencyCategories = await Context.WowCurrencyCategory
            .AsNoTracking()
            .OrderBy(category => category.Id)
            .Select(category => new StaticCurrencyCategory(category))
            .ToArrayAsync();

        foreach (var category in cacheData.RawCurrencyCategories)
        {
            category.Slug = GetString(StringType.WowCurrencyCategoryName, Language.enUS, category.Id).Slugify();
        }

        _timer.AddPoint("Currencies");

        // Illusions
        cacheData.Illusions = await LoadIllusions();
        _timer.AddPoint("Illusions");

        // Instances
        cacheData.InstancesRaw = await LoadInstances();
        _timer.AddPoint("Instances");

        // Professions
        var professions = await LoadProfessions();
        _timer.AddPoint("Professions");

        // Reputations
        var reputations = await Context.WowReputation
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
        cacheData.RawRealms = await Context.WowRealm
            .AsNoTracking()
            .OrderBy(realm => realm.Id)
            .ToListAsync();

        cacheData.ReputationTiers = new SortedDictionary<int, WowReputationTier>(
            await Context.WowReputationTier
                .AsNoTracking()
                .ToDictionaryAsync(c => c.Id)
        );

        _timer.AddPoint("Database");

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
            Logger.Information("{Lang}", language);

            cacheData.Professions = professions[language];
            cacheData.Soulbinds = soulbinds[language];

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

            foreach (var illusion in cacheData.Illusions)
            {
                illusion.Name = GetString(StringType.WowSpellItemEnchantmentName, language, illusion.EnchantmentId);
            }

            foreach (var currency in cacheData.RawCurrencies)
            {
                currency.Name = GetString(StringType.WowCurrencyName, language, currency.Id);
            }

            foreach (var currencyCategory in cacheData.RawCurrencyCategories)
            {
                currencyCategory.Name = GetString(StringType.WowCurrencyCategoryName, language, currencyCategory.Id);
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

            string cacheJson = System.Text.Json.JsonSerializer.Serialize(cacheData, JsonSerializerOptions);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"static-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache", true);
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

        var skillLines = await DataUtilities.LoadDumpCsvAsync<DumpSkillLine>(
            Path.Join("enUS", "skillline"));

        var skillLineAbilities = await DataUtilities.LoadDumpCsvAsync<DumpSkillLineAbility>(
            "skilllineability");

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
                Path.Join("enUS", "spellname"),
                dsn => skillLineSpellIds.Contains(dsn.ID)
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
                    Path.Join(language.ToString(), "tradeskillcategory"),
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
                    Logger.Warning("No profession categories for profession {id}", professionId);
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
                        Categories = professionRootCategories.GetValueOrDefault(profession.ID),
                    }
                );
        }
        return ret;
    }

    private async Task<Dictionary<Language, Dictionary<int, List<OutSoulbind>>>> LoadSoulbinds()
    {
        // Load
        var soulbinds = await DataUtilities.LoadDumpCsvAsync<DumpSoulbind>(Path.Join("enUS", "soulbind"));

        var soulbindOrder = (await DataUtilities.LoadDumpCsvAsync<DumpSoulbindUiDisplayInfo>("soulbinduidisplayinfo"))
            .OrderBy(di => di.OrderIndex)
            .Select(di => di.SoulbindID)
            .ToArray();

        var talentTreeIds = new HashSet<int>(soulbinds.Select(soulbind => soulbind.GarrTalentTreeID));
        var talents = await DataUtilities.LoadDumpCsvAsync<DumpGarrTalent>(
            "garrtalent",
            (talent) => talentTreeIds.Contains(talent.GarrTalentTreeID)
        );

        var talentIds = new HashSet<int>(talents.Select(talent => talent.ID));
        var talentSpellId = (await DataUtilities.LoadDumpCsvAsync<DumpGarrTalentRank>(
            "garrtalentrank",
            rank => talentIds.Contains(rank.GarrTalentID)
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

    private async Task<StaticIllusion[]> LoadIllusions()
    {
        return (await DataUtilities
            .LoadDumpCsvAsync<DumpTransmogIllusion>("transmogillusion"))
            .SelectArray(illusion => new StaticIllusion(illusion));
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
                    Logger.Warning("Invalid instance type for instance {InstanceId}: {Type}", journalInstance.ID, map.InstanceType);
                }
            }
            else
            {
                Logger.Warning("No mapsById entry for {InstanceId}??", journalInstance.ID);
            }
        }

        /*foreach (var map in maps.Where(m => mapIdToInstanceId.ContainsKey(m.ID) && InstanceTypes.Contains(m.InstanceType)))
        {
            if (mapIdToInstanceId.TryGetValue(map.ID, out int instanceId))
            {
                if (sigh.ContainsKey(instanceId))
                {
                    Logger.Information("DUPLICATE BULLSHIT: mapId={MapId} instanceId={InstanceId}", map.ID, instanceId);
                }
                else
                {
                    sigh.Add(instanceId, new OutInstance(map, instanceId));
                }
            }
            else
            {
                Logger.Information("No mapIdToInstanceId for {MapId}??", map.ID);
            }
        }*/
        return sigh.Values
            .OrderBy(instance => instance.Expansion)
            .ThenBy(instance => instance.Id)
            .ToList();
    }
    #endregion

}

internal struct AchievementCriteria
{
    public Dictionary<int, OutCriteria> Criteria;
    public Dictionary<int, OutCriteriaTree> CriteriaTree;
}
