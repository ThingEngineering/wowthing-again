using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Jobs.NonBlizzard;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheStaticJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;
        
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
            Version = 14,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            await BuildStaticData();
            await BuildAchievementData();
            
            Logger.Information("CacheStaticJob: {0}", _timer.ToString());
        }
        
        #region Static data
        public async Task BuildStaticData()
        {
            var db = Redis.GetDatabase();

            // RaiderIO
            var raiderIoScoreTiers = await db.JsonGetAsync<Dictionary<int, List<ApiDataRaiderIoScoreTier>>>(DataRaiderIoScoreTiersJob.CACHE_KEY);

            // Currencies
            var currencies = await LoadCurrencies();
            var currencyCategories = await LoadCurrencyCategories();

            // Instances
            var instances = await LoadInstances();

            // Mounts
            var spellToMount = await LoadMountDump();
            var mountSets = LoadSets("mounts");
            AddUncategorized("mounts", spellToMount, mountSets);
            _timer.AddPoint("Mounts");

            // Pets
            var creatureToPet = await LoadPetDump();
            var petSets = LoadSets("pets");
            AddUncategorized("pets", creatureToPet, petSets);
            _timer.AddPoint("Pets");

            // Reputations
            var reputations = await LoadReputations();

            var reputationSets = LoadReputationSets();
            _timer.AddPoint("Reputations");

            // Toys
            var itemToToy = await LoadToyDump();
            var toySets = LoadSets("toys");
            AddUncategorized("toys", itemToToy, toySets);
            _timer.AddPoint("Toys");

            // Basic database dumps
            var realms = new SortedDictionary<int, WowRealm>(await Context.WowRealm.ToDictionaryAsync(c => c.Id));
            //var reputations = new SortedDictionary<int, WowReputation>(await _context.WowReputation.ToDictionaryAsync(c => c.Id));
            var reputationTiers = new SortedDictionary<int, WowReputationTier>(await Context.WowReputationTier.ToDictionaryAsync(c => c.Id));
            _timer.AddPoint("Database");

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

                RaiderIoScoreTiers = raiderIoScoreTiers ?? new Dictionary<int, List<ApiDataRaiderIoScoreTier>>(),
            };
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();
            _timer.AddPoint("JSON");

            await db.StringSetAsync("cached_static:data", cacheJson);
            await db.StringSetAsync("cached_static:hash", cacheHash);
            _timer.AddPoint("Cache", true);
        }

        private static List<DataReputationCategory> LoadReputationSets()
        {
            var categories = new List<DataReputationCategory>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(Utilities.Utilities.DataPath, "reputations");
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                var filePath = Path.Join(basePath, line);
                categories.Add(yaml.Deserialize<DataReputationCategory>(File.OpenText(filePath)));
            }

            return categories;
        }

        private static async Task<SortedDictionary<int, OutCurrency>> LoadCurrencies()
        {
            var types = await Utilities.Utilities.LoadDumpCsvAsync<DumpCurrencyTypes>("currencytypes");
            return new SortedDictionary<int, OutCurrency>(types.ToDictionary(k => k.ID, v => new OutCurrency(v)));
        }

        private static async Task<SortedDictionary<int, OutCurrencyCategory>> LoadCurrencyCategories()
        {
            var categories = await Utilities.Utilities.LoadDumpCsvAsync<DumpCurrencyCategory>("currencycategory");
            return new SortedDictionary<int, OutCurrencyCategory>(categories.ToDictionary(k => k.ID, v => new OutCurrencyCategory(v)));
        }

        private static async Task<SortedDictionary<int, OutReputation>> LoadReputations()
        {
            var factions = await Utilities.Utilities.LoadDumpCsvAsync<DumpFaction>("faction");

            return new SortedDictionary<int, OutReputation>(factions.ToDictionary(k => k.ID, v => new OutReputation(v)));
        }

        private static readonly HashSet<int> InstanceTypes = new HashSet<int>() {
            1, // Party Dungeon
            2, // Raid Dungeon
        };
        private async Task<SortedDictionary<int, OutInstance>> LoadInstances()
        {
            var journalInstances = await Utilities.Utilities.LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");
            var mapIdToInstanceId = journalInstances
                .GroupBy(instance => instance.MapID)
                .ToDictionary(k => k.Key, v => v.OrderByDescending(instance => instance.OrderIndex).First().ID);

            var maps = await Utilities.Utilities.LoadDumpCsvAsync<DumpMap>("map");

            var sigh = new SortedDictionary<int, OutInstance>();
            foreach (var map in maps.Where(m => mapIdToInstanceId.ContainsKey(m.ID) && InstanceTypes.Contains(m.InstanceType)))
            {
                if (mapIdToInstanceId.TryGetValue(map.ID, out int instanceId))
                {
                    if (sigh.ContainsKey(instanceId))
                    {
                        Logger.Information("DUPLICATE BULLSHIT {0}", map.ID, instanceId);
                    }
                    else
                    {
                        sigh.Add(instanceId, new OutInstance(map, instanceId));
                    } 
                }
                else
                {
                    Logger.Information("No mapIdToInstanceId for {0}??", map.ID);
                } 
            }
            return sigh;
        }

        private static async Task<SortedDictionary<int, int>> LoadMountDump()
        {
            var records = await Utilities.Utilities.LoadDumpCsvAsync<DumpMount>("mount");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.SourceSpellID, v => v.ID));
        }

        private static async Task<SortedDictionary<int, int>> LoadPetDump()
        {
            var records = await Utilities.Utilities.LoadDumpCsvAsync<DumpBattlePetSpecies>("battlepetspecies", p => (p.Flags & 32) == 0);
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.CreatureID, v => v.ID));
        }

        private static async Task<SortedDictionary<int, int>> LoadToyDump()
        {
            var records = await Utilities.Utilities.LoadDumpCsvAsync<DumpToy>("toy");
            return new SortedDictionary<int, int>(records.ToDictionary(k => k.ItemID, v => v.ID));
        }

        private static List<List<RedisSetCategory>> LoadSets(string dirName)
        {
            var categories = new List<List<RedisSetCategory>>();
            var yaml = new DeserializerBuilder()
                .WithNamingConvention(LowerCaseNamingConvention.Instance)
                .Build();

            var basePath = Path.Join(Utilities.Utilities.DataPath, dirName);
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
            var skipPath = Path.Join(Utilities.Utilities.DataPath, dirName, "_skip.yml");
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
                                Things = missing.Select(m => new[]{ m }).ToList(),
                            }
                        }
                    }
                });
            }
        }
        #endregion
        
        #region Achievement data
        public async Task BuildAchievementData()
        {
            var db = Redis.GetDatabase();

            var categories = await LoadAchievementCategories();
            
            // Ok we're done
            var cacheData = new RedisStaticAchievements()
            {
                Categories = categories,
            };
            var cacheJson = JsonConvert.SerializeObject(cacheData);
            var cacheHash = cacheJson.Md5();
            _timer.AddPoint("JSON");

            await db.StringSetAsync("cached_achievements:data", cacheJson);
            await db.StringSetAsync("cached_achievements:hash", cacheHash);
            _timer.AddPoint("Cache", true);
        }

        private static HashSet<int> _skipAchievementCategories = new()
        {
            1, // Statistics
            15076, // Guild
        };
        private static async Task<List<OutAchievementCategory>> LoadAchievementCategories()
        {
            var records = await Utilities.Utilities.LoadDumpCsvAsync<DumpAchievementCategory>("achievement_category");
            var recordMap = records.ToDictionary(
                record => record.ID,
                record => new OutAchievementCategory(record)
            );

            // Attach children
            foreach (var record in records)
            {
                if (record.Parent > -1)
                {
                    recordMap[record.Parent].Children.Add(recordMap[record.ID]);
                }
            }
            
            // Sort everything by Order
            foreach (var category in recordMap.Values)
            {
                category.Children.Sort((a, b) => a.Order.CompareTo(b.Order));
            }

            // Return all root categories that aren't in the skip list
            return recordMap.Values
                .Where(record => record.Parent == -1 && !_skipAchievementCategories.Contains(record.Id))
                .OrderBy(record => record.Order)
                .ToList();
        }
        #endregion
    }
}
