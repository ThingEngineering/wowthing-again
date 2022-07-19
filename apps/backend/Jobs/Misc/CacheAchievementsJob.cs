using Wowthing.Backend.Data;
using Wowthing.Backend.Models.Data.Achievements;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class CacheAchievementsJob : JobBase, IScheduledJob
{
    private readonly JankTimer _timer = new();

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.CacheAchievements,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 1,
    };

    public override async Task Run(params string[] data)
    {
        var db = Redis.GetDatabase();

        var achievements = await LoadAchievements();
        var categories = await LoadAchievementCategories(achievements[Language.enUS]);
        var criteria = await LoadAchievementCriteria(achievements[Language.enUS]);

        _timer.AddPoint("Load");

        // Ok we're done
        var cacheData = new RedisStaticAchievements
        {
            CriteriaRaw = criteria[Language.enUS].Criteria.Values.ToList(),
        };

        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            Logger.Information("{Lang}", language);

            cacheData.AchievementRaw = achievements[language]
                .Values
                .OrderBy(ach => ach.Id)
                .ToList();

            cacheData.Categories = categories[language];

            cacheData.CriteriaTreeRaw = criteria[language].CriteriaTree
                .Values
                .OrderBy(ct => ct.Id)
                .ToList();

            var cacheJson = JsonConvert.SerializeObject(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await db.SetCacheDataAndHash($"achievement-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache", true);
        Logger.Information("{0}", _timer.ToString());
    }

    private static readonly HashSet<int> SkipAchievementCategories = new()
    {
        1, // Statistics
        15076, // Guild
    };

    private async Task<Dictionary<Language, List<OutAchievementCategory>>> LoadAchievementCategories(Dictionary<int, OutAchievement> achievements)
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

        var rootCategories = outMap.Values
            .Where(record => record.Parent == -1 && !SkipAchievementCategories.Contains(record.Id))
            .OrderBy(record => record.Order)
            .ToList();

        // Create language data
        var ret = new Dictionary<Language, List<OutAchievementCategory>>();
        foreach (var language in Enum.GetValues<Language>())
        {
            if (language == Language.enUS)
            {
                ret[language] = rootCategories;
            }
            else
            {
                var langNames = (await DataUtilities
                        .LoadDumpCsvAsync<DumpAchievementCategory>(
                            Path.Join(language.ToString(), "achievement_category"),
                            skipValidation: true
                        ))
                    .ToDictionary(cat => cat.ID, cat => cat.Name);

                ret[language] = new();
                foreach (var category in rootCategories)
                {
                    ret[language].Add(GetLanguageCategory(langNames, category));
                }
            }
        }
        return ret;
    }

    private OutAchievementCategory GetLanguageCategory(Dictionary<int, string> langNames, OutAchievementCategory category)
    {
        var langCategory = (OutAchievementCategory)category.Clone();
        langCategory.Name = langNames[category.Id];

        langCategory.Children = new();
        foreach (var childCategory in category.Children.EmptyIfNull())
        {
            langCategory.Children.Add(GetLanguageCategory(langNames, childCategory));
            Logger.Debug(
                "child {child} = {name} = {name2}",
                childCategory.Id,
                childCategory.Name,
                langCategory.Children.Last().Name
            );
        }

        return langCategory;
    }

    private static async Task<Dictionary<Language, Dictionary<int, OutAchievement>>> LoadAchievements()
    {
        var ret = new Dictionary<Language, Dictionary<int, OutAchievement>>();
        var records = await DataUtilities
            .LoadDumpCsvAsync<DumpAchievement>(Path.Join("enUS", "achievement"));

        var achievementMap = records
            .Where(a => !a.Flags.HasFlag(WowAchievementFlags.Tracking))
            .Where(a => !Hardcoded.IgnoredAchievements.Contains(a.ID))
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
}
