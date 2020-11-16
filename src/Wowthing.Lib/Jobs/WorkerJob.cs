using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Jobs
{
    public class WorkerJob
    {
        public string Data { get; set; }
        public JobPriority Priority { get; set; }
        public JobType Type { get; set; }
    }
}
