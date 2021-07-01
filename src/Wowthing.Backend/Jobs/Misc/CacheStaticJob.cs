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
using Wowthing.Backend.Jobs.NonBlizzard;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Services;
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
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
            Version = 13,
        };

        public override async Task Run(params string[] data)
        {
            var db = _redis.GetDatabase();
            var timer = new JankTimer();

            // RaiderIO
            var raiderIoScoreTiers = await db.JsonGetAsync<List<ApiDataRaiderIoScoreTier>>(DataRaiderIoScoreTiersJob.CACHE_KEY);

            // Currencies
            var currencies = await LoadCurrencies();
            var currencyCategories = await LoadCurrencyCategories();

            // Instances
            var instances = await LoadInstances();

            // Mounts
            var spellToMount = await LoadMountDump();
            var mountSets = LoadSets("mounts");
            AddUncategorized("mounts", spellToMount, mountSets);
            timer.AddPoint("Mounts");

            // Pets
            var creatureToPet = await LoadPetDump();
            var petSets = LoadSets("pets");
            AddUncategorized("pets", creatureToPet, petSets);
            timer.AddPoint("Pets");

            // Reputations
            var reputations = await LoadReputations();

            var reputationSets = LoadReputationSets();
            timer.AddPoint("Reputations");

            // Toys
            var itemToToy = await LoadToyDump();
            var toySets = LoadSets("toys");
            AddUncategorized("toys", itemToToy, toySets);
            timer.AddPoint("Toys");

            // Basic database dumps
            var realms = new SortedDictionary<int, WowRealm>(await _context.WowRealm.ToDictionaryAsync(c => c.Id));
            //var reputations = new SortedDictionary<int, WowReputation>(await _context.WowReputation.ToDictionaryAsync(c => c.Id));
            var reputationTiers = new SortedDictionary<int, WowReputationTier>(await _context.WowReputationTier.ToDictionaryAsync(c => c.Id));
            timer.AddPoint("Database");

            // Ok we're done
            var cacheData = new RedisStaticCache
            {
                Currencies = currencies,
                CurrencyCategories = currencyCategories,
                Instances = instances,
                Realms = realms,
                Reputations = reputations,
                ReputationTiers = reputationTiers,

                MountSets = mountSets,
                SpellToMount = spellToMount,

                CreatureToPet = creatureToPet,
                PetSets = petSets,

                ReputationSets = reputationSets,

                ToySets = toySets,

                RaiderIoScoreTiers = raiderIoScoreTiers ?? new List<ApiDataRaiderIoScoreTier>(),
            };
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();
            timer.AddPoint("JSON");

            await db.StringSetAsync("cached_static:data", cacheJson);
            await db.StringSetAsync("cached_static:hash", cacheHash);
            timer.AddPoint("Cache", true);

            _logger.Information("CacheStaticJob: {0}", timer.ToString());
        }

        private static List<DataReputationCategory> LoadReputationSets()
        {
            var categories = new List<DataReputationCategory>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(Utilities.DATA_PATH, "reputations");
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(yaml.Deserialize<DataReputationCategory>(File.OpenText(filePath)));
            }

            return categories;
        }

        private static async Task<SortedDictionary<int, DataCurrency>> LoadCurrencies()
        {
            var types = await Utilities.LoadDumpCsvAsync<DumpCurrencyTypes>("currencytypes");
            return new SortedDictionary<int, DataCurrency>(types.ToDictionary(k => k.ID, v => new DataCurrency(v)));
        }

        private static async Task<SortedDictionary<int, DataCurrencyCategory>> LoadCurrencyCategories()
        {
            var categories = await Utilities.LoadDumpCsvAsync<DumpCurrencyCategory>("currencycategory");
            return new SortedDictionary<int, DataCurrencyCategory>(categories.ToDictionary(k => k.ID, v => new DataCurrencyCategory(v)));
        }

        private static async Task<SortedDictionary<int, OutReputation>> LoadReputations()
        {
            var factions = await Utilities.LoadDumpCsvAsync<DumpFaction>("faction");

            return new SortedDictionary<int, OutReputation>(factions.ToDictionary(k => k.ID, v => new OutReputation(v)));
        }

        private static readonly HashSet<int> INSTANCE_TYPES = new HashSet<int>() {
            1, // Party Dungeon
            2, // Raid Dungeon
        };
        private async Task<SortedDictionary<int, DataInstance>> LoadInstances()
        {
            var journalInstances = await Utilities.LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");
            var mapIdToInstanceId = journalInstances
                .GroupBy(instance => instance.MapID)
                .ToDictionary(k => k.Key, v => v.OrderByDescending(instance => instance.OrderIndex).First().ID);

            var maps = await Utilities.LoadDumpCsvAsync<DumpMap>("map");

            var sigh = new SortedDictionary<int, DataInstance>();
            foreach (var map in maps.Where(m => mapIdToInstanceId.ContainsKey(m.ID) && INSTANCE_TYPES.Contains(m.InstanceType)))
            {
                if (mapIdToInstanceId.TryGetValue(map.ID, out int instanceId))
                {
                    if (sigh.ContainsKey(instanceId))
                    {
                        _logger.Information("DUPLICATE BULLSHIT {0}", map.ID, instanceId);
                    }
                    else
                    {
                        sigh.Add(instanceId, new DataInstance(map, instanceId));
                    } 
                }
                else
                {
                    _logger.Information("No mapIdToInstanceId for {0}??", map.ID);
                } 
            }
            return sigh;
        }

        private static async Task<SortedDictionary<int, int>> LoadMountDump()
        {
            var records = await Utilities.LoadDumpCsvAsync<DataMountDump>("mount");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.SourceSpellID, v => v.ID));
        }

        private static async Task<SortedDictionary<int, int>> LoadPetDump()
        {
            var records = await Utilities.LoadDumpCsvAsync<DataPetDump>("battlepetspecies", p => (p.Flags & 32) == 0);
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.CreatureID, v => v.ID));
        }

        private static async Task<SortedDictionary<int, int>> LoadToyDump()
        {
            var records = await Utilities.LoadDumpCsvAsync<DataToyDump>("toy");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.ItemID, v => v.ID));
        }

        private static List<List<RedisSetCategory>> LoadSets(string dirName)
        {
            var categories = new List<List<RedisSetCategory>>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(Utilities.DATA_PATH, dirName);
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                if (line == "-")
                {
                    categories.Add(null);
                }
                else
                {
                    var things = new List<RedisSetCategory>();
                    foreach (string fileName in line.Split(' '))
                    {
                        var filePath = Path.Join(basePath, fileName);
                        things.Add(new RedisSetCategory(yaml.Deserialize<DataSetCategory>(File.OpenText(filePath))));
                    }
                    categories.Add(things);
                }
            }

            return categories;
        }

        private static void AddUncategorized(string dirName, SortedDictionary<int, int> spellToThing, List<List<RedisSetCategory>> thingSets)
        {
            var skip = Array.Empty<int>();
            var skipPath = Path.Join(Utilities.DATA_PATH, dirName, "_skip.yml");
            if (File.Exists(skipPath))
            {
                var newSkip = new DeserializerBuilder()
                    .Build()
                    .Deserialize<string[]>(File.OpenText(skipPath));
                if (newSkip != null)
                {
                    skip = newSkip.SelectMany(s => s.Split(' ')).Select(s => int.Parse(s)).ToArray();
                }
            }

            // Lookup keys - things in sets - skip
            var missing = spellToThing.Keys
                .Except(thingSets
                    .Where(s => s != null)
                    .SelectMany(s => s)
                    .SelectMany(s => s.Groups)
                    .SelectMany(g => g.Things)
                    .SelectMany(t => t)
                )
                .Except(skip)
                .ToArray();
            
            if (missing.Length > 0)
            {
                thingSets.Add(new List<RedisSetCategory>{
                    new RedisSetCategory
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
                    }
                });
            }
        }
    }
}
