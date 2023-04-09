using Wowthing.Lib.Models.Wow;

public class StaticReputationTier : WowReputationTier
{
    public string[]? Names { get; set; }

    public StaticReputationTier(WowReputationTier tier) : base(tier.Id)
    {
        MinValues = tier.MinValues;
    }
}
