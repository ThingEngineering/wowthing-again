using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Data;

public class DataQuestsStartJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataQuestsStart,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(5),
        Version = 1,
    };

    public override async Task Run(string[] data)
    {
        var questIds = await Context
            .WowQuest
            .Where(wq => wq.LastApiCheck < DateTime.UtcNow.AddDays(-30))
            .Select(wq => wq.Id)
            .ToArrayAsync();

        foreach (var questId in questIds)
        {
            await JobRepository.AddJobAsync(JobPriority.Low, JobType.DataQuest, questId.ToString());
        }

        await Context.WowQuest
            .Where(wq => questIds.Contains(wq.Id))
            .ExecuteUpdateAsync(s => s
                .SetProperty(wq => wq.LastApiCheck, wq => DateTime.UtcNow)
            );
    }
}
