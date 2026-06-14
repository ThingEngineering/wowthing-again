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

    [Name("FiltRaceMasks[0]")]
    public int FiltRaceMasks0 { get; set; }
    [Name("FiltRaceMasks[1]")]
    public int FiltRaceMasks1 { get; set; }

    public long FiltRaces =>
        (FiltRaceMasks0 > 0 || FiltRaceMasks1 > 0) ? (FiltRaceMasks0 & ((long)FiltRaceMasks1 << 32)) : -1;

    [Name("QuestTitle_lang")]
    public string Title { get; set; } = string.Empty;
}
