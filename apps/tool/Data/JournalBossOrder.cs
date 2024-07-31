namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly Dictionary<int, int[]> JournalBossOrder = new()
    {
        // Blackrock Foundry
        {
            457,
            new[]
            {
                1000457, // Trash Drops
                1202, // Slagworks: Oregorger
                1161, // Slagworks: Gruul
                1154, // Slagworks: The Blast Furnace
                1155, // Black Forge: Hans'gar and Franzok
                1123, // Black Forge: Flamebender Ka'graz
                1162, // Black Forge: Kromog
                1122, // Iron Assembly: Beastlord Darmac
                1147, // Iron Assembly: Operator Thogar
                1203, // Iron Assembly: Iron Maidens
                959, // Blackhand's Crucible: Blackhand
            }
        },
    };
}
