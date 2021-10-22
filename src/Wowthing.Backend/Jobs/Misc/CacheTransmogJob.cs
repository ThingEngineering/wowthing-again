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
        private string _basePath;
        private JankTimer _timer;
        private IDeserializer _yaml = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheTransmog,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 1,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            _basePath = Path.Join(DataUtilities.DataPath, "transmog");
            
            await BuildTransmogData();
            
            Logger.Information("CacheTransmogJob: {0}", _timer.ToString());
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
            await db.StringSetAsync("cache:transmog:data", cacheJson);
            await db.StringSetAsync("cache:transmog:hash", cacheHash);
            _timer.AddPoint("Cache", true);
        }
    }
}
