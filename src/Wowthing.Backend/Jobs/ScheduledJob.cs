using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs
{
    public class ScheduledJob
    {
        public JobPriority Priority;
        public JobType Type;
        public TimeSpan Interval;
        public int Version = 1;

        private string _redisKey;
        public string RedisKey
        {
            get
            {
                if (_redisKey == null)
                {
                    _redisKey = $"{Type}_v{Version}";
                }
                return _redisKey;
            }
        }
    }
}
