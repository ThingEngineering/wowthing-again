namespace Wowthing.Tool.Models.Items;

// ReSharper disable InconsistentNaming
public class DumpItemBonusTreeNode
{
    public int ID { get; set; }
    public int ChildItemBonusListID { get; set; }
    public int ChildItemBonusListGroupID { get; set; }
    public int ChildItemBonusTreeID { get; set; }
    public int ItemContext { get; set; }
    public int ParentItemBonusTreeID { get; set; }
}
