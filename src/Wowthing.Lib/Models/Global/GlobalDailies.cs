using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Global;

public class GlobalDailies
{
    public int Expansion { get; set; }
    public WowRegion Region { get; set; }

    public List<int> QuestIds { get; set; } = new();
    public List<int> QuestExpires { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public List<GlobalDailiesReward> QuestRewards { get; set; } = new();
}

public class GlobalDailiesReward
{
    public int CurrencyId { get; set; }
    public int ItemId { get; set; }
    public int Money { get; set; }
    public int Quality { get; set; }
    public int Quantity { get; set; }
}
