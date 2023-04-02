﻿namespace Wowthing.Lib.Jobs;

public enum JobType
{
    UserCharacters = 0,

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
    CharacterStatistics,

    DataReputationTiers = 202,
    DataTitle = 203,
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

    // Scheduled jobs
    DataMythicKeystonePeriod = 1001,
    DataMythicKeystonePeriodIndex = 1002,
    DataMythicKeystoneSeasonIndex = 1003,
    DataRaiderIoScoreTiers = 1006,
    DataRealmIndex = 1007,
    DataReputationTiersIndex = 1009,
    DataTitleIndex = 1010,
    DataAuctionsStart = 1015,
    DataAuctions = 1016,
    DataQuestsStart = 1021,
    DataQuest = 1022,

    MaintenanceUnlinkCharacters = 2000,
    MaintenanceDeleteAchievements = 2001,
}
