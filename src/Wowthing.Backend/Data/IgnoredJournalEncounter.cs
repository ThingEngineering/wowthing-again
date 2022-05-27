namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        public static readonly HashSet<int> IgnoredJournalEncounter = new()
        {
             634, // WotLk/ToC/Grand Champions [shows raid difficulties]
            1872, // Legion/NH/Grand Magistrix Elisande [dupe with only LFR loot]
            2340, // Grong, the Revenant [dupe]
            2344, // Champion of the Light [dupe]
        };
    }
}
