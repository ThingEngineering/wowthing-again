namespace Wowthing.Tool.Models.Reputations;

public class ManualReputationCategoryReputation
{
    public int Id { get; set; }
    public string Icon { get; set; }
    public string Note { get; set; }
    public List<ManualReputationCategoryReputationReward> Rewards { get; set; }
}
