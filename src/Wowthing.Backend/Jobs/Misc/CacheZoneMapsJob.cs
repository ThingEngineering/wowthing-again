using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheZoneMapsJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;
        private IDeserializer _yaml = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheZoneMaps,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 2,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();
            
            await BuildData();
            
            Logger.Information("{0}", _timer.ToString());
        }

        private async Task BuildData()
        {
            // Generate and cache output
            var zoneMapSets = DataUtilities.LoadData<DataZoneMapCategory>("zone-maps", Logger);

            var sets = new List<List<OutZoneMapCategory>>();
            foreach (var catList in zoneMapSets)
            {
                if (catList == null)
                {
                    sets.Add(null);
                }
                else
                {
                    sets.Add(catList.Select(cat => cat == null ? null : new OutZoneMapCategory(cat))
                        .ToList());
                }
            }
            
            var cacheData = new RedisZoneMapCache
            {
                Sets = sets,
            };
            
            _timer.AddPoint("Load");
            
            // ItemID vs AppearanceID hack
            var itemModifiedAppearances = await DataUtilities.LoadDumpCsvAsync<DumpItemModifiedAppearance>("itemmodifiedappearance");
            var itemToAppearance = itemModifiedAppearances
                .GroupBy(r => r.ItemID)
                .ToDictionary(r => r.Key, r => r.First().ItemAppearanceID);

            var seenQuests = new HashSet<int>();
            using (var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "zone-maps", "addon.txt")))
            {
                foreach (var categories in cacheData.Sets)
                {
                    if (categories == null)
                    {
                        continue;
                    }
                    
                    foreach (var category in categories)
                    {
                        if (category == null)
                        {
                            continue;
                        }
                        
                        outFile.WriteLine("    -- Zone Maps: {0}", category.Name);
                        foreach (var farm in category.Farms)
                        {
                            foreach (var questId in farm.QuestIds)
                            {
                                if (questId > 0 && !seenQuests.Contains(questId))
                                {
                                    outFile.WriteLine("    {0}, -- {1}", questId, farm.Name);
                                    seenQuests.Add(questId);
                                }
                            }
                            
                            foreach (var drop in farm.Drops)
                            {
                                if (drop.Type == "transmog" && drop.Id > 100000)
                                {
                                    drop.Id = itemToAppearance[drop.Id];
                                }

                                if (drop.QuestId > 0 && !seenQuests.Contains(drop.QuestId.Value))
                                {
                                    outFile.WriteLine("    {0}, -- {1}:{2}", drop.QuestId, farm.Name, drop.Name);
                                    seenQuests.Add(drop.QuestId.Value);
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
            await db.SetCacheDataAndHash("zone-map", cacheJson, cacheHash);
            
            _timer.AddPoint("Cache", true);
        }
    }
}
