namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    // JournalEncounterId -> { Difficulty, Statistic }
    public static readonly Dictionary<int, Dictionary<int, int>> JournalEncounterStatistics = new()
    {
        #region Shadowlands
        // Necrotic Wake -> Nalthor the Rimebinder
        { 2396, new()
            {
                { 1, 14402 }, // Normal
                { 2, 14403 }, // Heroic
                { 23, 14404 }, // Mythic
            }
        },
        #endregion
    };
}
