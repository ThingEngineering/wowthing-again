namespace Wowthing.Tool.Models.Traits;

// ReSharper disable InconsistentNaming
public class DumpTraitCond
{
    public int ID { get; set; }

    public int CondType { get; set; }
    public int GrantedRanks { get; set; }
    public int SpentAmountRequired { get; set; }
    public int TraitCurrencyID { get; set; }
    public int TraitNodeID { get; set; }
    public int TraitNodeGroupID { get; set; }
    public int TraitTreeID { get; set; }
}
