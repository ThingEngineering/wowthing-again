// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Items;

public class DumpItemBonusListGroupEntry
{
    public int ID { get; set; }

    public int Flags { get; set; }
    public int ItemBonusListGroupID { get; set; }
    public int ItemBonusListID { get; set; }
    public int ItemExtendedCostID { get; set; }
    public int ItemLevelSelectorID { get; set; }
    public int ItemLogicalCostGroupID { get; set; }
    public int PlayerConditionID { get; set; }
    public int SequenceValue { get; set; }
}
