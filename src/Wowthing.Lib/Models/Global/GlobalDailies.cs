using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Global;

public class GlobalDailies
{
    public int Expansion { get; set; }
    public WowRegion Region { get; set; }

    public List<int> QuestIds { get; set; } = new();
    public List<int> QuestExpires { get; set; } = new();
}
