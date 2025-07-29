namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredJournalItems = new()
    {
        // Things screwed up by Duos
        37686, // Cracked Epoch Grasps (CoS)
        37687, // Gloves of Distorted Time (CoS)

        56376, // Thundercall (now 133251)
        120163, // Thruk's Fishing Rod
        178708, // Unbound Changeling??
    };
}
