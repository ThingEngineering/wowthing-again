using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Models;

public class QueuedJob
{
    public long Id { get; set; }
    public DateTime? StartedAt { get; set; }
    public JobPriority Priority { get; set; }
    public JobType Type { get; set; }
    public string Data { get; set; }
}
