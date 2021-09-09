namespace Wowthing.Lib.Jobs
{
    public class WorkerJob
    {
        public JobPriority Priority { get; set; }
        public JobType Type { get; set; }
        public string[] Data { get; set; }
    }
}
