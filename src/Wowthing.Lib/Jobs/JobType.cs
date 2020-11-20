using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Jobs
{
    public enum JobType
    {
        UserCharacters = 0,

        Character = 100,

        // Scheduled jobs
        DataPlayableRaceIndex = 1000,
        DataPlayableClassIndex,
        DataPlayableClass,
        DataRealmIndex,
        CacheStatic,
    }
}
