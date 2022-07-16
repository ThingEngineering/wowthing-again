using MoreLinq.Extensions;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Data;
using Wowthing.Backend.Jobs.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Achievements;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Models.Static;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheStaticJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;
        private readonly IDeserializer _yaml = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

        private Dictionary<int, WowItem> _itemMap;
        private Dictionary<int, WowMount> _mountMap;
        private Dictionary<int, WowPet> _petMap;
        private Dictionary<int, WowToy> _toyMap;

        private Dictionary<int, int> _itemToAppearance;
        private readonly HashSet<int> _itemIds = new();

        private Dictionary<(StringType Type, Language Language, int Id), string> _stringMap;

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
            Version = 51,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            await LoadData();

            await BuildStaticData();
            await BuildAchievementData();

            Logger.Information("{0}", _timer.ToString());
        }

        public static readonly StringType[] StringTypes = {
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
                    group => group.Key,
                    group => group
                        .OrderBy(ima => ima.Modifier)
                        .First()
                        .AppearanceId
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
            var classes =  await Context.WowCharacterClass
                .OrderBy(cls => cls.Id)
                .ToArrayAsync();

            var races = await Context.WowCharacterRace
                .OrderBy(race => race.Id)
                .ToArrayAsync();

            var specs = await Context.WowCharacterSpecialization
                .Where(spec => spec.Order < 4)
                .OrderBy(spec => spec.Id)
                .ToArrayAsync();

            // Currencies
            var currencies = await Context.WowCurrency
                .Where(currency => !Hardcoded.IgnoredCurrencies.Contains(currency.Id))
                .OrderBy(currency => currency.Id)
                .ToArrayAsync();

            var currencyCategories = await Context.WowCurrencyCategory
                .OrderBy(category => category.Id)
                .ToArrayAsync();

            _timer.AddPoint("Currencies");

            // Instances
            var instances = await LoadInstances();
            _timer.AddPoint("Instances");

            // Professions
            var professions = await LoadProfessions();

            // Reputations
            var reputations = await Context.WowReputation
                .OrderBy(rep => rep.Id)
                .ToArrayAsync();

            cacheData.RawReputationSets = LoadReputationSets();
            _timer.AddPoint("Reputations");

            // Soulbinds
            var soulbinds = await LoadSoulbinds();
            _timer.AddPoint("Soulbinds");

            // Talents
            cacheData.Talents = await LoadTalents();
            _timer.AddPoint("Talents");

            // Basic database dumps
            cacheData.RealmsRaw = await Context.WowRealm
                .OrderBy(realm => realm.Id)
                .ToListAsync();

            var reputationTiers = new SortedDictionary<int, WowReputationTier>(await Context.WowReputationTier.ToDictionaryAsync(c => c.Id));

            _timer.AddPoint("Database");

            // Add anything that uses strings
            string cacheHash = null;
            foreach (var language in Enum.GetValues<Language>())
            {
                Logger.Information("Static {Lang}", language);

                cacheData.CharacterClasses = classes.Select(cls => new StaticCharacterClass(cls)
                {
                    Name = GetString(StringType.WowCharacterClassName, language, cls.Id),
                }).ToDictionary(cls => cls.Id);

                cacheData.CharacterRaces = races.Select(race => new StaticCharacterRace(race)
                {
                    Name = GetString(StringType.WowCharacterRaceName, language, race.Id),
                }).ToDictionary(race => race.Id);

                cacheData.CharacterSpecializations = specs.Select(spec => new StaticCharacterSpecialization(spec)
                {
                    Name = GetString(StringType.WowCharacterSpecializationName, language, spec.Id),
                }).ToDictionary(spec => spec.Id);

                cacheData.RawCurrencies = currencies.Select(currency => new StaticCurrency(currency)
                {
                    Name = GetString(StringType.WowCurrencyName, language, currency.Id),
                }).ToArray();

                cacheData.RawCurrencyCategories = currencyCategories.Select(category => new StaticCurrencyCategory(category)
                {
                    Name = GetString(StringType.WowCurrencyCategoryName, language, category.Id),
                }).ToArray();

                cacheData.RawItems = _itemIds
                    .OrderBy(itemId => itemId)
                    .Select(itemId => new StaticItem(_itemMap[itemId])
                    {
                        AppearanceId = _itemToAppearance.GetValueOrDefault(itemId),
                        Name = GetString(StringType.WowItemName, language, itemId),
                    }).ToArray();

                cacheData.RawReputations = reputations.Select(rep => new StaticReputation(rep)
                {
                    Name = GetString(StringType.WowReputationName, language, rep.Id),
                    Description = GetString(StringType.WowReputationDescription, language, rep.Id),
                }).ToArray();

                cacheData.InstancesRaw = instances;
                cacheData.Professions = professions[language];
                cacheData.ReputationTiers = reputationTiers;
                cacheData.Soulbinds = soulbinds[language];

                cacheData.RawMounts = RawMounts(language);
                cacheData.RawPets = RawPets(language);
                cacheData.RawToys = RawToys(language);

                var cacheJson = JsonConvert.SerializeObject(cacheData);
                // This ends up being the MD5 of enUS, close enough
                if (cacheHash == null)
                {
                    cacheHash = cacheJson.Md5();
                }

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

        private List<DataReputationCategory> LoadReputationSets()
        {
            var categories = new List<DataReputationCategory>();

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
                    categories.Add(_yaml.Deserialize<DataReputationCategory>(File.OpenText(filePath)));
                }
            }

            foreach (var category in categories.Where(category => category != null))
            {
                foreach (var reputationSet in category.Reputations)
                {
                    foreach (var reputation in reputationSet)
                    {
                        AddReputationItems(reputation.Both);
                        AddReputationItems(reputation.Alliance);
                        AddReputationItems(reputation.Horde);
                    }
                }
            }

            return categories;
        }

        private void AddReputationItems(DataReputation reputation)
        {
            if (reputation?.Rewards != null)
            {
                foreach (var reward in reputation.Rewards)
                {
                    if (reward.Type == "transmog")
                    {
                        _itemIds.Add(reward.Id);
                    }
                }
            }
        }

        private async Task<Dictionary<Language, Dictionary<int, OutProfession>>> LoadProfessions()
        {
            var skillLines = await DataUtilities.LoadDumpCsvAsync<DumpSkillLine>(Path.Join("enUS", "skillline"));

            var professions = skillLines
                .Where(line => Hardcoded.PrimaryProfessions.Contains(line.ID) ||
                               Hardcoded.SecondaryProfessions.Contains(line.ID))
                .ToArray();

            var subProfessions = skillLines
                .Where(line => (Hardcoded.PrimaryProfessions.Contains(line.ParentSkillLineID) ||
                               Hardcoded.SecondaryProfessions.Contains(line.ParentSkillLineID)) &&
                               !Hardcoded.IgnoredProfessions.Contains(line.ID))
                .ToGroupedDictionary(line => line.ParentSkillLineID);

            var ret = new Dictionary<Language, Dictionary<int, OutProfession>>();
            foreach (var language in Enum.GetValues<Language>())
            {
                ret[language] = professions
                    .ToDictionary(
                        profession => profession.ID,
                        profession => new OutProfession
                        {
                            Id = profession.ID,
                            Name = GetString(StringType.WowSkillLineName, language, profession.ID),
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
                    v => v.OrderByDescending(instance => instance.OrderIndex)
                        .First()
                        .ID
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

        private List<JArray> RawMounts(Language language)
        {
            return _mountMap
                .Values
                .OrderBy(mount => mount.Id)
                .Select(mount => new JArray(
                    mount.Id,
                    mount.SourceType,
                    mount.ItemId,
                    mount.SpellId,
                    GetString(StringType.WowMountName, language, mount.Id)
                ))
                .ToList();
        }

        private List<JArray> RawPets(Language language)
        {
            return _petMap
                .Values
                .OrderBy(pet => pet.Id)
                .Select(pet => new JArray(
                    pet.Id,
                    pet.SourceType,
                    pet.PetType,
                    pet.CreatureId,
                    pet.SpellId,
                    GetString(StringType.WowCreatureName, language, pet.CreatureId)
                ))
                .ToList();
        }

        private List<JArray> RawToys(Language language)
        {
            return _toyMap
                .Values
                .OrderBy(toy => toy.Id)
                .Select(toy => new JArray(
                    toy.Id,
                    toy.SourceType,
                    toy.ItemId,
                    GetString(StringType.WowItemName, language, toy.ItemId)
                ))
                .ToList();
        }
        #endregion

        #region Achievement data
        public async Task BuildAchievementData()
        {
            var db = Redis.GetDatabase();

            var achievements = await LoadAchievements();
            var categories = await LoadAchievementCategories(achievements[Language.enUS]);
            var criteria = await LoadAchievementCriteria(achievements[Language.enUS]);

            // Ok we're done
            var cacheData = new RedisStaticAchievements
            {
                Categories = categories,
                CriteriaRaw = criteria[Language.enUS].Criteria.Values.ToList(),
            };

            string cacheHash = null;
            foreach (var language in Enum.GetValues<Language>())
            {
                Logger.Information("Achievement {Lang}", language);

                cacheData.AchievementRaw = achievements[language].Values.ToList();
                cacheData.CriteriaTreeRaw = criteria[language].CriteriaTree.Values.ToList();

                var cacheJson = JsonConvert.SerializeObject(cacheData);
                // This ends up being the MD5 of enUS, close enough
                if (cacheHash == null)
                {
                    cacheHash = cacheJson.Md5();
                }

                await db.SetCacheDataAndHash($"achievement-{language.ToString()}", cacheJson, cacheHash);
            }

            _timer.AddPoint("Cache", true);
        }

        private static readonly HashSet<int> SkipAchievementCategories = new()
        {
            1, // Statistics
            15076, // Guild
        };

        private static async Task<List<OutAchievementCategory>> LoadAchievementCategories(Dictionary<int, OutAchievement> achievements)
        {
            var records = await DataUtilities.LoadDumpCsvAsync<DumpAchievementCategory>("achievement_category");
            var outMap = records.ToDictionary(
                record => record.ID,
                record => new OutAchievementCategory(record)
            );

            var achievementMap = achievements.Values
                .GroupBy(a => a.CategoryId)
                .ToDictionary(g => g.Key, g => g.Select(a => a.Id).ToList());

            foreach (var record in records)
            {
                // Attach children
                if (record.Parent > -1)
                {
                    outMap[record.Parent].Children.Add(outMap[record.ID]);
                }

                // Attach achievements
                if (achievementMap.ContainsKey(record.ID))
                {
                    outMap[record.ID].AchievementIds = achievementMap[record.ID];
                }
            }

            // Sort everything by Order
            foreach (var category in outMap.Values)
            {
                category.Children.Sort((a, b) => a.Order.CompareTo(b.Order));
            }

            // Return all root categories that aren't in the skip list
            return outMap.Values
                .Where(record => record.Parent == -1 && !SkipAchievementCategories.Contains(record.Id))
                .OrderBy(record => record.Order)
                .ToList();
        }

        private static async Task<Dictionary<Language, Dictionary<int, OutAchievement>>> LoadAchievements()
        {
            var ret = new Dictionary<Language, Dictionary<int, OutAchievement>>();
            var records = await DataUtilities
                .LoadDumpCsvAsync<DumpAchievement>(Path.Join("enUS", "achievement"));

            var achievementMap = records
                .Where(a => !a.Flags.HasFlag(WowAchievementFlags.Tracking))
                .Select(a => new OutAchievement(a))
                .ToDictionary(a => a.Id);

            foreach (var achievement in achievementMap.Values)
            {
                if (achievement.Supersedes > 0 && achievementMap.ContainsKey(achievement.Supersedes))
                {
                    achievementMap[achievement.Supersedes].SupersededBy = achievement.Id;
                }
            }

            ret[Language.enUS] = achievementMap;

            foreach (var language in Enum.GetValues<Language>())
            {
                if (language == Language.enUS)
                {
                    continue;
                }

                var langRecords = await DataUtilities
                    .LoadDumpCsvAsync<DumpAchievement>(Path.Join(language.ToString(), "achievement"), skipValidation: true);

                var langMap = new Dictionary<int, OutAchievement>();
                //foreach (var (achievementId, achievement) in ret[Language.enUS])
                foreach (var record in langRecords)
                {
                    if (ret[Language.enUS].TryGetValue(record.ID, out var usAchievement))
                    {
                        langMap[record.ID] = (OutAchievement)usAchievement.Clone();
                        langMap[record.ID].Description = record.Description;
                        langMap[record.ID].Name = record.Name;
                    }
                }

                ret[language] = langMap;
            }

            return ret;
        }

        private async Task<Dictionary<Language, AchievementCriteria>> LoadAchievementCriteria(Dictionary<int, OutAchievement> achievements)
        {
            var ret = new Dictionary<Language, AchievementCriteria>();

            var criteria = await DataUtilities.LoadDumpCsvAsync<DumpCriteria>("criteria");
            //var criteriaMap = criteria.ToDictionary(c => c.ID);

            var criteriaTrees = await DataUtilities.LoadDumpCsvAsync<DumpCriteriaTree>("criteriatree");
            var criteriaTreeMap = criteriaTrees.ToDictionary(ct => ct.ID);

            //var modifierTrees = await CsvUtilities.LoadDumpCsvAsync<DumpModifierTree>("modifiertree");
            //var modifierTreeMap = modifierTrees.ToDictionary(mt => mt.ID);

            // Keep track of CriteriaTree tree
            foreach (var criteriaTree in criteriaTrees.Where(ct => ct.Parent > 0))
            {
                if (criteriaTreeMap.TryGetValue(criteriaTree.Parent, out var parent))
                {
                    parent.Children.Add(criteriaTree);
                }
            }

            // Filter things
            var achievementCriteriaTrees = new HashSet<int>(achievements.Values.Select(a => a.CriteriaTreeId));
            var filtered = criteriaTrees
                .Where(ct => achievementCriteriaTrees.Contains(ct.ID))
                .ToArray();
            var final = filtered
                .Concat(
                    filtered
                        .SelectManyRecursive(ct => ct.Children)
                )
                .OrderBy(ct => ct.ID);

            ret[Language.enUS] = new AchievementCriteria
            {
                Criteria = criteria
                    .Select(c => new OutCriteria(c))
                    .ToDictionary(c => c.Id),

                CriteriaTree = final
                    .Select(ct => new OutCriteriaTree(ct))
                    .ToDictionary(ct => ct.Id),
            };

            foreach (var language in Enum.GetValues<Language>())
            {
                if (language == Language.enUS)
                {
                    continue;
                }

                var langRecords = await DataUtilities
                    .LoadDumpCsvAsync<DumpCriteriaTree>(Path.Join(language.ToString(), "criteriatree"), skipValidation: true);

                var langMap = new Dictionary<int, OutCriteriaTree>();
                foreach (var record in langRecords)
                {
                    if (ret[Language.enUS].CriteriaTree.TryGetValue(record.ID, out var usCriteria))
                    {
                        langMap[record.ID] = (OutCriteriaTree)usCriteria.Clone();
                        langMap[record.ID].Description = record.Description;
                    }
                }

                ret[language] = new AchievementCriteria
                {
                    CriteriaTree = langMap,
                };
            }

            return ret;
        }
        #endregion
    }

    internal struct AchievementCriteria
    {
        public Dictionary<int, OutCriteria> Criteria;
        public Dictionary<int, OutCriteriaTree> CriteriaTree;
    }
}
