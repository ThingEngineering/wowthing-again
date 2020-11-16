using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Extensions
{
    public static class JobPriorityExtensions
    {
        public static string GetQueueName(this JobPriority priority)
        {
            return $"queue_{ priority.ToString().ToLowerInvariant() }";
        }
    }
}
