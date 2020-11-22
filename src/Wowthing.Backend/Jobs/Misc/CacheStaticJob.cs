using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheStaticJob : JobBase, IScheduledJob
    {
        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
        };

        public override async Task Run(params string[] data)
        {
            var db = _redis.GetDatabase();

            var cacheData = new RedisStaticCache
            {
                Classes = new SortedDictionary<int, WowClass>(await _context.WowClass.ToDictionaryAsync(c => c.Id)),
                Races = new SortedDictionary<int, WowRace>(await _context.WowRace.ToDictionaryAsync(c => c.Id)),
                Realms = new SortedDictionary<int, WowRealm>(await _context.WowRealm.ToDictionaryAsync(c => c.Id)),

                MountSets = LoadSets("mounts"),
            };
            
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            await db.StringSetAsync("cached_static:data", cacheJson);
            await db.StringSetAsync("cached_static:hash", cacheHash);
        }

        private SortedDictionary<int, int> LoadMounts()
        {
            var ret = new SortedDictionary<int, int>();

            return ret;
        }

        private List<RedisSetCategory> LoadSets(string dirName)
        {
            var categories = new List<RedisSetCategory>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join("..", "..", "data", dirName);
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(new RedisSetCategory(yaml.Deserialize<DataSetCategory>(File.OpenText(filePath))));
            }

            return categories;
        }
    }
}
