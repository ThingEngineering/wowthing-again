using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Jobs
{
    public enum JobType
    {
        UserCharacters = 0,

        Character = 100,

        DataPlayableClass = 200,
        DataTitle,

        // Scheduled jobs
        CacheStatic = 1000,
        DataPlayableRaceIndex,
        DataPlayableClassIndex,
        DataRealmIndex,
        DataTitleIndex,
    }
}
