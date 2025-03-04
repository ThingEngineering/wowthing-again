namespace Wowthing.Lib.Jobs;

public enum JobType : short
{
    UserCharacters = 0,
    UserBulkData,

    Character = 100,
    CharacterAchievements,
    CharacterEquipment,
    CharacterMounts,
    CharacterMythicKeystoneProfile,
    CharacterMythicKeystoneProfileSeason,
    CharacterPets,
    CharacterProfessions,
    CharacterQuestsCompleted,
    CharacterReputations,
    CharacterSoulbinds,
    CharacterMedia,
    CharacterSpecializations,
    CharacterAchievementStatistics,
    CharacterToys,
    CharacterHeirlooms,
    CharacterStats,
    CharacterTransmogs,

    DataConnectedRealmIndex = 204,
    DataConnectedRealm = 205,

    // Non-Blizzard jobs
    CharacterRaiderIo = 500,

    // Internal jobs
    UserUpload = 900,
    Image = 901,
    UserCacheAchievements = 902,
    UserCacheTransmog = 903,
    UserCacheQuests = 904,
    UserCacheMounts = 905,

    // Scheduled jobs
    DataMythicKeystonePeriod = 1001,
    DataMythicKeystonePeriodIndex = 1002,
    DataMythicKeystoneSeasonIndex = 1003,
    DataRaiderIoScoreTiers = 1006,
    DataRealmIndex = 1007,
    DataAuctionsStart = 1015,
    DataAuctions = 1016,
    DataQuestsStart = 1021,
    DataQuest = 1022,

    MagicAggregateWorldQuests = 1100,

    MaintenanceUnlinkCharacters = 2000,
    // MaintenanceDeleteAchievements = 2001,
    MaintenanceDeleteWorldQuestReports = 2002,
    MaintenanceDeleteOldAuctionTables = 2003,
    MaintenanceBackfillUserCache = 2004,
    MaintenanceDeleteCharacters = 2005,
    MaintenanceAggregateHourlyAuctionData = 2006,
}
