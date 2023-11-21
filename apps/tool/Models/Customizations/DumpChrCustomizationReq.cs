using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Customizations;

// ReSharper disable InconsistentNaming
public class DumpChrCustomizationReq
{
    public int ID { get; set; }
    public int ReqAchievementID { get; set; }
    public int ReqItemModifiedAppearanceID { get; set; }
    public int ReqQuestID { get; set; }
    public int ReqType { get; set; }

    [Name("ReqSource_lang")]
    public string ReqSource { get; set; } = string.Empty;
}
