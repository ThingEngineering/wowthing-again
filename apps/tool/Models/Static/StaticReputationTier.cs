using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Static;

public class StaticReputationTier : WowReputationTier
{
    public string[]? Names { get; set; }

    public StaticReputationTier(WowReputationTier tier) : base(tier.Id)
    {
        MinValues = tier.MinValues;
    }
}
