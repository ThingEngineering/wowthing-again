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
    }
}
