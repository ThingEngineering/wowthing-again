using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;
using Wowthing.Tool.Extensions;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticReputationConverter))]
public class StaticReputation : WowReputation
{
    public string Description { get; set; }
    public string Name { get; set; }

    public StaticReputation(WowReputation reputation) : base(reputation.Id)
    {
        AccountWide = reputation.AccountWide;
        Expansion = reputation.Expansion;
        ParagonId = reputation.ParagonId;
        ParentId = reputation.ParagonId;
        RenownCurrencyId = reputation.RenownCurrencyId;
        TierId = reputation.TierId;

        BaseValues = reputation.BaseValues.EmptyIfNull().TrimTrailingZeroes();
        MaxValues = reputation.MaxValues.EmptyIfNull().TrimTrailingZeroes();
    }
}
