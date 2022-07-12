using Wowthing.Backend.Models.Data.Journal;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Manual.Transmog;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheTransmogJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheTransmog,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 2,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            await BuildTransmogData();

            Logger.Information("{Timers}", _timer.ToString());
        }

        private async Task BuildTransmogData()
        {
            // Generate and cache output
            var transmogSets = DataUtilities.LoadData<DataTransmogCategory>("transmog", Logger);

            var cacheData = new RedisTransmogCache
            {
                Sets = transmogSets.Select(
                    sets => sets?.Select(
                            set => new ManualTransmogCategory(set))
                        .ToList()
                    )?.ToList(),
            };

            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            var db = Redis.GetDatabase();
            await db.SetCacheDataAndHash("transmog", cacheJson, cacheHash);
            _timer.AddPoint("Cache", true);
        }
    }
}
