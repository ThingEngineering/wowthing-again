﻿namespace Wowthing.Lib.Enums
{
    [Flags]
    public enum WowAchievementFlags
    {
        Counter = 0x1,
        Hidden = 0x2,
        PlayNoVisual = 0x4,
        Sum = 0x8,
        MaxUsed = 0x10,
        ReqCount = 0x20,
        Average = 0x40,
        ProgressBar = 0x80,
        RealmFirstReach = 0x100,
        RealmFirstKill = 0x200,
        HideIncomplete = 0x800,
        ShowInGuildNews = 0x1000,
        ShowInGuildHeader = 0x2000,
        Guild = 0x4000,
        ShowGuildMembers = 0x8000,
        ShowCriteriaMembers = 0x10000,
        AccountWide = 0x20000,
        HideZeroCounter = 0x80000,
        Tracking = 0x100000,
    }
}
