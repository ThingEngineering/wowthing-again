namespace Wowthing.Tool.Models.Traits;

public class OutTraitNode
{
    public int NodeId { get; set; }
    public int RankMax { get; set; }
    public int RankEntryId { get; set; }
    public int UnlockEntryId { get; set; }
    public string Name { get; set; }

    public List<OutTraitNode> Children { get; set; } = new();
    public List<OutTraitPerk> Perks { get; set; } = new();

    public OutTraitNode(int nodeId)
    {
        NodeId = nodeId;
    }
}
