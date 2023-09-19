namespace Wowthing.Lib.Constants;

public static class RedisKeys
{
    public const string AuctionsLock = "lock:auctions";
    public const string CheckedAuctions = "checked_auctions";

    public const string UserAchievements = "user:{0}:achievements";
    //public const string UserMounts = "collections:{0}:mounts";
    public const string UserQuests = "user:{0}:quests";
    public const string UserTransmog = "user:{0}:transmog";

    public const string ManualLastModified = "manual:last_modified";
    public const string UserLastModifiedAchievements = "user:{0}:last_modified:achievements";
    public const string UserLastModifiedGeneral = "user:{0}:last_modified:general";
    public const string UserLastModifiedQuests = "user:{0}:last_modified:quests";
    public const string UserLastModifiedTransmog = "user:{0}:last_modified:transmog";
}
