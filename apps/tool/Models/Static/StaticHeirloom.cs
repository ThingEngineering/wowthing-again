namespace Wowthing.Tool.Models.Static;

public class StaticHeirloom
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public List<int> UpgradeBonusIds { get; set; }
    public List<int> UpgradeItemIds { get; set; }
}
