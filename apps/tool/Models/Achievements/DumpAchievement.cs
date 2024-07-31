using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Achievements;

public class DumpAchievement
{
    public int Category { get; set; }
    public int CovenantID { get; set; }
    public int Faction { get; set; }
    public WowAchievementFlags Flags { get; set; }
    public int IconFileID { get; set; }
    public int ID { get; set; }
    public int Points { get; set; }
    public int Supercedes { get; set; }

    [Name("Criteria_tree")]
    public int CriteriaTree { get; set; }

    [Name("Minimum_criteria")]
    public int MinimumCriteria { get; set; }

    [Name("Shares_criteria")]
    public int SharesCriteria { get; set; }

    [Name("Ui_order")]
    public int UiOrder { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("Title_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("Reward_lang")]
    public string Reward { get; set; } = string.Empty;
}
