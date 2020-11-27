using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Jobs
{
    public enum JobType
    {
        UserCharacters = 0,

        Character = 100,
        CharacterMounts,
        CharacterReputations,
      
        DataPlayableClass = 200,
        DataReputationFaction,
        DataReputationTiers,
        DataTitle,

        // Scheduled jobs
        CacheStatic = 1000,
        DataPlayableRaceIndex,
        DataPlayableClassIndex,
        DataRealmIndex,
        DataReputationFactionIndex,
        DataReputationTiersIndex,
        DataTitleIndex,
    }
}
