// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Journal;

public class DumpJournalEncounterItem
{
    public int ID { get; set; }

    public int DifficultyMask { get; set; }
    public int FactionMask { get; set; }
    public int Flags { get; set; }
    public int ItemID { get; set; }
    public int JournalEncounterID { get; set; }
}