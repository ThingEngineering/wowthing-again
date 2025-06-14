using Serilog.Context;
using Wowthing.Tool.Models.Achievements;

namespace Wowthing.Tool.Tools;

public class AchievementsTool
{
    private readonly JankTimer _timer = new();

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Achievements");
        var db = ToolContext.Redis.GetDatabase();

        ToolContext.Logger.Information("Loading data...");

        var achievements = await LoadAchievements();
        var categories = await LoadAchievementCategories(achievements[Language.enUS]);
        var criteria = await LoadAchievementCriteria(achievements[Language.enUS]);

        var hideIds = achievements[Language.enUS]
            .Values
            .Where(achievement =>
                achievement.Name.StartsWith("Ahead of the Curve:") ||
                achievement.Name.StartsWith("Challenge Master:") ||
                achievement.Name.StartsWith("Cutting Edge:") ||
                achievement.Name.StartsWith("Challenge Master:") ||
                achievement.Name.StartsWith("Realm First!") ||
                (
                    achievement.Description.StartsWith("Obtain the ") &&
                    (
                        achievement.Description.Contains("Gladiator's") ||
                        achievement.Description.Contains("Arena Season")
                    ) &&
                    !achievement.Description.Contains("Shadowlands Season 4")
                )
            )
            .Select(achievement => achievement.Id)
            .Distinct()
            .OrderBy(id => id)
            .ToArray();

        _timer.AddPoint("Load");

        // Ok we're done
        var cacheData = new RedisAchievements
        {
            CriteriaRaw = criteria[Language.enUS].Criteria.Values.ToList(),
        };

        string? cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {Lang}...", language);

            cacheData.AchievementRaw = achievements[language]
                .Values
                .OrderBy(ach => ach.Id)
                .ToList();

            cacheData.Categories = categories[language];

            cacheData.CriteriaTreeRaw = criteria[language].CriteriaTree
                .Values
                .OrderBy(ct => ct.Id)
                .ToList();

            cacheData.HideIds = hideIds;

            var cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await db.SetCacheDataAndHash($"achievement-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Generate");

        var (accountTrees, characterTrees) = CriteriaSuck(achievements[Language.enUS], criteria[Language.enUS]);

        var ugh = new CriteriaCounts
        {
            Account = accountTrees.ToArray(),
            Character = characterTrees.ToArray(),
        };
        var ughJson = ToolContext.SerializeJson(ugh);
        var ughHash = ughJson.Md5();
        await db.SetCacheDataAndHash("criteria-trees", ughJson, ughHash);

        ToolContext.Logger.Information("{a} {b}", ugh.Account.Length, ugh.Character.Length);

        _timer.AddPoint("CriteriaCounts", true);

        ToolContext.Logger.Information("{0}", _timer.ToString());
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
                        .LoadDumpCsvAsync<DumpAchievementCategory>("achievement_category", language))
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
        }

        return langCategory;
    }

    private static async Task<Dictionary<Language, Dictionary<int, OutAchievement>>> LoadAchievements()
    {
        var ret = new Dictionary<Language, Dictionary<int, OutAchievement>>();
        var records = await DataUtilities
            .LoadDumpCsvAsync<DumpAchievement>("achievement");

        var achievementMap = records
            // .Where(a => !a.Flags.HasFlag(WowAchievementFlags.Tracking))
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
                .LoadDumpCsvAsync<DumpAchievement>("achievement", language);

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
                .LoadDumpCsvAsync<DumpCriteriaTree>("criteriatree", language);

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

    private (HashSet<int>, HashSet<int>) CriteriaSuck(
        Dictionary<int, OutAchievement> achievements,
        AchievementCriteria criteria)
    {
        var account = new HashSet<int>();
        var character = new HashSet<int>();
        var stack = new Stack<int>();

        foreach (var achievement in achievements.Values)
        {
            bool accountWide = (achievement.Flags & WowAchievementFlags.AccountWide) > 0;
            stack.Push(achievement.CriteriaTreeId);

            while (stack.Count > 0)
            {
                int criteriaTreeId = stack.Pop();
                if (!criteria.CriteriaTree.TryGetValue(criteriaTreeId, out var criteriaTree))
                {
                    continue;
                }

                if (accountWide)
                {
                    account.Add(criteriaTreeId);
                }
                else
                {
                    character.Add(criteriaTreeId);
                }

                foreach (var childId in criteriaTree.Children)
                {
                    stack.Push(childId);
                }
            }
        }

        ToolContext.Logger.Information("a={a} c={c}", account.Count, character.Count);

        return (account, character);
    }

    private class CriteriaCounts
    {
        public int[] Account { get; set; }
        public int[] Character { get; set; }
    }

    private struct AchievementCriteria
    {
        public Dictionary<int, OutCriteria> Criteria;
        public Dictionary<int, OutCriteriaTree> CriteriaTree;
    }
}
