using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Achievements;

public class DumpCriteria
{
    public int Asset { get; set; }
    public int ID { get; set; }
    public int Type { get; set; }

    [Name("Eligibility_world_state_ID")]
    public int EligibilityWorldStateID { get; set; }

    [Name("Eligibility_world_state_value")]
    public int EligibilityWorldStateValue { get; set; }

    [Name("Modifier_tree_ID")]
    public int ModifierTreeID { get; set; }

    [Name("Fail_asset")]
    public int FailAsset { get; set; }

    [Name("Fail_event")]
    public int FailEvent { get; set; }

    [Name("Start_asset")]
    public int StartAsset { get; set; }

    [Name("Start_event")]
    public int StartEvent { get; set; }

    [Name("Start_timer")]
    public int StartTimer { get; set; }
}
