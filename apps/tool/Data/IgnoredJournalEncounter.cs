namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredJournalEncounter = new()
    {
        485, // Classic/Zul'Farrak/Theka the Martyr [drops nothing useful]
        634, // WotLk/ToC/Grand Champions [shows raid difficulties]
        748, // Classic/Uldaman/Obsidian Sentinel [drops nothing useful]
        749, // Classic/Stratholme/Commander Malor [drops nothing useful]
        833, // WotLK/The Nexus/Commander Kolurg [raid difficulties, dupes Commander Stoutbeard]
        858, // Yu'lon
        859, // Niu'zao
        860, // Xuen
        1764, // TBC/Karazhan/Chess Event [dupe]
        1872, // Legion/NH/Grand Magistrix Elisande [dupe with only LFR loot]
        2340, // Grong, the Revenant [dupe]
        2344, // Champion of the Light [dupe]
    };
}
