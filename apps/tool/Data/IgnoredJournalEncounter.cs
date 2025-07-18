﻿namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredJournalEncounter = new()
    {
        485, // Classic/Zul'Farrak/Theka the Martyr [drops nothing useful]
        748, // Classic/Uldaman/Obsidian Sentinel [drops nothing useful]
        749, // Classic/Stratholme/Commander Malor [drops nothing useful]
        858, // Yu'lon
        859, // Niu'zao
        860, // Xuen
        1872, // Legion/NH/Grand Magistrix Elisande [dupe with only LFR loot]
    };
}
