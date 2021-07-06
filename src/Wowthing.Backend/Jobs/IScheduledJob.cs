namespace Wowthing.Backend.Jobs
{
    public interface IScheduledJob
    {
        // NOTE this field is only ever accessed via reflection 
        // ReSharper disable once UnassignedReadonlyField
        public static readonly ScheduledJob Schedule;
    }
}
