using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Traits;

// ReSharper disable InconsistentNaming
public class DumpTraitNodeEntry
{
    public int ID { get; set; }

    public int MaxRanks { get; set; }
    public int TraitDefinitionID { get; set; }
    public TraitNodeEntryType NodeEntryType { get; set; }
}
