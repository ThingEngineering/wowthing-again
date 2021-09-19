using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Farms;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheFarmsJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;
        private IDeserializer _yaml = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheFarms,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 1,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();
            
            await BuildFarmData();
            
            Logger.Information("{0}", _timer.ToString());
        }

        private async Task BuildFarmData()
        {
            // Generate and cache output
            var farmSets = DataUtilities.LoadData<DataFarmCategory>("farms");
            
            var cacheData = new RedisFarmCache
            {
                Sets = farmSets.Select(
                    cats => cats.Select(cat => new OutFarmCategory(cat)).ToList()
                ).ToList(),
            };
            
            _timer.AddPoint("Load");
            
            // ItemID vs AppearanceID hack
            var itemModifiedAppearances = await DataUtilities.LoadDumpCsvAsync<DumpItemModifiedAppearance>("itemmodifiedappearance");
            var itemToAppearance = itemModifiedAppearances
                .GroupBy(r => r.ItemID)
                .ToDictionary(r => r.Key, r => r.First().ItemAppearanceID);
            
            using (var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "farms", "addon.txt")))
            {
                foreach (var categories in cacheData.Sets)
                {
                    foreach (var category in categories)
                    {
                        outFile.WriteLine("    -- Farms: {0}", category.Name);
                        foreach (var farm in category.Farms)
                        {
                            foreach (var questId in farm.QuestIds)
                            {
                                outFile.WriteLine("    {0}, -- {1}", questId, farm.Name);
                            }
                            
                            foreach (var drop in farm.Drops)
                            {
                                if (drop.Type == "transmog" && drop.Id > 100000)
                                {
                                    drop.Id = itemToAppearance[drop.Id];
                                }
                            }
                        }
                    }
                }
            }


            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            _timer.AddPoint("JSON");
            
            var db = Redis.GetDatabase();
            await db.StringSetAsync("cache:farm:data", cacheJson);
            await db.StringSetAsync("cache:farm:hash", cacheHash);
            
            _timer.AddPoint("Cache", true);
        }
    }
}
