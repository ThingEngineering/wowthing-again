using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MoreLinq;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
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

            _basePath = Path.Join(CsvUtilities.DataPath, "transmog");
            _categoryCache = new();
            
            await BuildTransmogData();
            
            Logger.Information("CacheTransmogJob: {0}", _timer.ToString());
        }

        private async Task BuildTransmogData()
        {
            // Generate and cache output
            var transmogSets = LoadTransmogSets();
            
            var cacheData = new RedisTransmogCache
            {
                Sets = transmogSets,
            };
            
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            var db = Redis.GetDatabase();
            await db.StringSetAsync("cache:transmog:data", cacheJson);
            await db.StringSetAsync("cache:transmog:hash", cacheHash);
            _timer.AddPoint("Cache", true);
        }

        private List<List<OutTransmogCategory>> LoadTransmogSets()
        {
            var categories = new List<List<OutTransmogCategory>>();

            List<OutTransmogCategory> things = null;
            foreach (var line in File.ReadLines(Path.Join(_basePath, "_order")))
            {
                if (line.Trim() == "")
                {
                    continue;
                }
                
                // Separator
                if (line == "-")
                {
                    if (things != null)
                    {
                        categories.Add(things);
                        things = null;
                    }
                    categories.Add(null);
                }
                else if (line.StartsWith("    "))
                {
                    // Subgroup
                    things.Add(LoadFile(line));
                }
                else
                {
                    // Group
                    if (things != null)
                    {
                        categories.Add(things);
                    }
                    
                    things = new List<OutTransmogCategory>
                    {
                        LoadFile(line),
                    };
                }
            }

            if (things != null)
            {
                categories.Add(things);
            }

            return categories;
        }

        private Dictionary<string, OutTransmogCategory> _categoryCache;
        private OutTransmogCategory LoadFile(string fileName)
        {
            var parts = fileName.Trim().Split(' ', 2);
            var filePath = Path.Join(_basePath, parts[0]);

            if (!_categoryCache.TryGetValue(filePath, out var otc))
            {
                Logger.Debug("Loading {0}", parts[0]);
                otc = _categoryCache[filePath] = new OutTransmogCategory(_yaml.Deserialize<DataTransmogCategory>(File.OpenText(filePath)));
            }
            
            if (parts.Length == 2)
            {
                otc = (OutTransmogCategory)otc.Clone();
                otc.Name = parts[1];
            }

            return otc;
        }
    }
}
