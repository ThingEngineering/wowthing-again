using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Jobs
{
    public enum JobType
    {
        UserCharacters = 0,

        Character = 100,
        CharacterEquipment,
        CharacterMounts,
        CharacterMythicKeystoneProfile,
        CharacterMythicKeystoneProfileSeason,
        CharacterQuestsCompleted,
        CharacterReputations,
        CharacterSoulbinds,
      
        DataPlayableClass = 200,
        DataReputationFaction,
        DataReputationTiers,
        DataTitle,

        Upload = 999,

        // Scheduled jobs
        CacheStatic = 1000,
        DataMythicKeystonePeriod,
        DataMythicKeystonePeriodIndex,
        DataMythicKeystoneSeasonIndex,
        DataPlayableRaceIndex,
        DataPlayableClassIndex,
        DataRealmIndex,
        DataReputationFactionIndex,
        DataReputationTiersIndex,
        DataTitleIndex,
    }
}
