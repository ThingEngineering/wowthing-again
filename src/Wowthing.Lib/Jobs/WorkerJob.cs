using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Jobs
{
    public class WorkerJob
    {
        public JobType Type { get; set; }
        public string[] Data { get; set; }
    }
}
