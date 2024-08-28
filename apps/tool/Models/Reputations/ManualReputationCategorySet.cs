namespace Wowthing.Tool.Models.Reputations;

public class ManualReputationCategorySet
{
    public ManualReputationCategoryReputation Both { get; set; }
    public ManualReputationCategoryReputation Alliance { get; set; }
    public ManualReputationCategoryReputation Horde { get; set; }

    public bool Paragon { get; set; } = false;
}
