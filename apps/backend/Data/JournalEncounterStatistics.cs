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

        #region Mists of Pandaria
        { 691, new() // Sha of Anger
            {
                { 14, 6989 },
            }
        },
        { 725, new() // Galleon
            {
                { 14, 6990 },
            }
        },
        { 814, new() // Nalak
            {
                { 14, 8146 },
            }
        },
        { 826, new() // Oondasta
            {
                { 14, 8147 },
            }
        },
        #endregion
    };
}
