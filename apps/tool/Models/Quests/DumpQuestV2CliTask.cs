using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Quests;

// ReSharper disable InconsistentNaming
public class DumpQuestV2CliTask
{
    public int ConditionID { get; set; }
    public int FiltCompletedQuestLogic { get; set; }
    public int ID { get; set; }

    public short ContentTuningID { get; set; }
    public short QuestInfoID { get; set; }

    [Name("FiltCompletedQuest[0]")]
    public int FiltCompletedQuest0 { get; set; }

    [Name("FiltCompletedQuest[1]")]
    public int FiltCompletedQuest1 { get; set; }

    [Name("FiltCompletedQuest[2]")]
    public int FiltCompletedQuest2 { get; set; }

    [Name("QuestTitle_lang")]
    public string Title { get; set; } = string.Empty;
}
