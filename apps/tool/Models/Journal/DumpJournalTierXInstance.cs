using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Journal;

public class DumpJournalTierXInstance
{
    public int ID { get; set; }

    public int JournalInstanceID { get; set; }
    public int JournalTierID { get; set; }
    public int OrderIndex { get; set; }

    [Name("AvailabilityCondition")]
    public int MaybePlayerConditionID { get; set; }
}
