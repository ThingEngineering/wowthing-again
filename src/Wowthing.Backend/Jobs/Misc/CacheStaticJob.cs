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
using Wowthing.Lib.Utilities;
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
            Version = 7,
        };

        public override async Task Run(params string[] data)
        {
            var db = _redis.GetDatabase();
            var timer = new JankTimer();

            // Mounts
            var spellToMount = await LoadMountDump();
            var mountSets = LoadSets("mounts");
            AddUncategorized("mounts", spellToMount, mountSets);
            timer.AddPoint("Mounts");

            // Reputations
            var reputationSets = LoadReputations();
            timer.AddPoint("Reputations");

            // Basic database dumps
            var classes = new SortedDictionary<int, WowClass>(await _context.WowClass.ToDictionaryAsync(c => c.Id));
            var races = new SortedDictionary<int, WowRace>(await _context.WowRace.ToDictionaryAsync(c => c.Id));
            var realms = new SortedDictionary<int, WowRealm>(await _context.WowRealm.ToDictionaryAsync(c => c.Id));
            var reputations = new SortedDictionary<int, WowReputation>(await _context.WowReputation.ToDictionaryAsync(c => c.Id));
            var reputationTiers = new SortedDictionary<int, WowReputationTier>(await _context.WowReputationTier.ToDictionaryAsync(c => c.Id));
            timer.AddPoint("Database");

            // Ok we're done
            var cacheData = new RedisStaticCache
            {
                Classes = classes,
                Races = races,
                Realms = realms,
                Reputations = reputations,
                ReputationTiers = reputationTiers,

                MountSets = mountSets,
                ReputationSets = reputationSets,
                SpellToMount = spellToMount,
            };
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();
            timer.AddPoint("JSON");

            await db.StringSetAsync("cached_static:data", cacheJson);
            await db.StringSetAsync("cached_static:hash", cacheHash);
            timer.AddPoint("Cache", true);

            _logger.Information("CacheStaticJob: {0}", timer.ToString());
        }

        private List<DataReputationCategory> LoadReputations()
        {
            var categories = new List<DataReputationCategory>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(DATA_PATH, "reputations");
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(yaml.Deserialize<DataReputationCategory>(File.OpenText(filePath)));
            }

            return categories;
        }

        private async Task<SortedDictionary<int, int>> LoadMountDump()
        {
            var records = await LoadDumpCsv<DataMountDump>("mount");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.SourceSpellID, v => v.ID));
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

        private void AddUncategorized(string dirName, SortedDictionary<int, int> spellToThing, List<RedisSetCategory> thingSets)
        {
            var skip = Array.Empty<int>();
            var skipPath = Path.Join(DATA_PATH, dirName, "_skip.yml");
            if (File.Exists(skipPath))
            {
                var newSkip = new DeserializerBuilder()
                    .Build()
                    .Deserialize<int[]>(File.OpenText(skipPath));
                if (newSkip != null)
                {
                    skip = newSkip;
                }
            }

            // Lookup keys - things in sets - skip
            var missing = spellToThing.Keys
                .Except(thingSets
                    .SelectMany(s => s.Groups)
                    .SelectMany(g => g.Things)
                    .SelectMany(t => t)
                )
                .Except(skip)
                .ToArray();
            
            if (missing.Length > 0)
            {
                thingSets.Add(new RedisSetCategory
                {
                    Name = "UNCATEGORIZED",
                    Groups = new List<RedisSetGroup>
                    {
                        new RedisSetGroup
                        {
                            Name = "UNCATEGORIZED",
                            Things = missing.Select(m => new int[]{ m }).ToList(),
                        }
                    }
                });
            }
        }
    }
}
