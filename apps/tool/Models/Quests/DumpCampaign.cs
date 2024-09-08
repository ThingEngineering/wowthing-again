using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Quests;

// ReSharper disable InconsistentNaming
public class DumpCampaign
{
    public int ID { get; set; }
    public int DisplayPriority { get; set; }
    public int Flags { get; set; }
    public int RewardQuestID { get; set; }
    public int UiTextureKitID { get; set; }

    // PlayerCondition?
    // Completed
    // OnlyStallIf
    // Prerequisite
    // Field_9_0_1_35755_007
    // Field_10_0_2_45779_012

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("Title_lang")]
    public string Title { get; set; } = string.Empty;
}
