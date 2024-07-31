using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceBackfillUserCacheJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceBackfillUserCache,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(5),
        Version = 1,
    };

    public override async Task Run(string[] data)
    {
        var timer = new JankTimer();

        var noToyCaches = await Context.UserCache
            .Where(uc => uc.CompletedQuests == 0
                         || uc.AppearanceIds == null
                         || uc.AppearanceSources == null
                         || uc.IllusionIds == null
                         || uc.MountIds == null
                         || uc.ToyIds == null)
            .OrderBy(uc => uc.UserId)
            .Take(50)
            .ToArrayAsync();

        timer.AddPoint("Query");

        foreach (var userCache in noToyCaches)
        {
            string userIdString = userCache.UserId.ToString();

            if (userCache.CompletedQuests == 0)
            {
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.UserCacheQuests, userIdString);
            }

            if (userCache.AppearanceIds == null || userCache.AppearanceSources == null || userCache.IllusionIds == null)
            {
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.UserCacheTransmog, userIdString);
            }

            if (userCache.MountIds == null)
            {
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.UserCacheMounts, userIdString);
            }

            if (userCache.ToyIds == null)
            {
                await CacheService.CreateOrUpdateToyCacheAsync(Context, timer, userCache.UserId, null, userCache);
            }
        }

        timer.AddPoint("Jobs", true);
        Logger.Information("{timer}", timer.ToString());
    }
}
