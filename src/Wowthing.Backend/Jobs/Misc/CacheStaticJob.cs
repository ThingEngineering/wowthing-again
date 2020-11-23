using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
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
#if DEBUG
        private static readonly string DATA_PATH = Path.Join("..", "..", "data");
#else
        private static readonly string DATA_PATH = "data";
#endif

        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
            Version = 2,
        };

        public override async Task Run(params string[] data)
        {
            var db = _redis.GetDatabase();

            var cacheData = new RedisStaticCache
            {
                Classes = new SortedDictionary<int, WowClass>(await _context.WowClass.ToDictionaryAsync(c => c.Id)),
                Races = new SortedDictionary<int, WowRace>(await _context.WowRace.ToDictionaryAsync(c => c.Id)),
                Realms = new SortedDictionary<int, WowRealm>(await _context.WowRealm.ToDictionaryAsync(c => c.Id)),

                MountToSpell = await LoadMountDump(),

                MountSets = LoadSets("mounts"),
            };
            
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();

            await db.StringSetAsync("cached_static:data", cacheJson);
            await db.StringSetAsync("cached_static:hash", cacheHash);
        }

        private async Task<SortedDictionary<int, int>> LoadMountDump()
        {
            var records = await LoadDumpCsv<DataMountDump>("mount");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.ID, v => v.SourceSpellID));
        }

        private async Task<List<T>> LoadDumpCsv<T>(string fileName)
        {
            var basePath = Path.Join(DATA_PATH, "dumps");
            var filePath = Directory.GetFiles(basePath, $"{fileName}-*.csv").OrderByDescending(f => f).First();

            var csvReader = new CsvReader(File.OpenText(filePath), CultureInfo.InvariantCulture);

            var ret = new List<T>();
            await foreach (T record in csvReader.GetRecordsAsync<T>())
            {
                ret.Add(record);
            }
            return ret;
        }

        private List<RedisSetCategory> LoadSets(string dirName)
        {
            var categories = new List<RedisSetCategory>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(DATA_PATH, dirName);
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(new RedisSetCategory(yaml.Deserialize<DataSetCategory>(File.OpenText(filePath))));
            }

            return categories;
        }
    }
}
