using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.CollectableSource;

// ReSharper disable InconsistentNaming
public class DumpCollectableSourceQuestSparse
{
    public int ID { get; set; }

    public int CollectableSourceInfoID { get; set; }
    public int QuestID { get; set; }
    public int QuestGiverCreatureID { get; set; }
    public int QuestMapID { get; set; }

    [Name("QuestPosition[0]")]
    public double QuestPosition0 { get; set; }

    [Name("QuestPosition[1]")]
    public double QuestPosition1 { get; set; }

    [Name("QuestPosition[2]")]
    public double QuestPosition2 { get; set; }
}
