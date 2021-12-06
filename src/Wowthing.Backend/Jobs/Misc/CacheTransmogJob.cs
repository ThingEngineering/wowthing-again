using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

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
                            set => new OutTransmogCategory(set))
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
