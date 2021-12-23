using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        [JsonProperty(Order = 0)]
        public List<OutCurrency> CurrenciesRaw { get; set; }
        [JsonProperty(Order = 1)]
        public SortedDictionary<int, OutCurrencyCategory> CurrencyCategories { get; set; }
        [JsonProperty(Order = 2)]
        public List<OutInstance> InstancesRaw { get; set; }
        [JsonProperty(Order = 3)]
        public List<List<OutProgress>> Progress { get; set; }
        [JsonProperty(Order = 4)]
        public List<WowRealm> RealmsRaw { get; set; }
        [JsonProperty(Order = 5)]
        public List<OutReputation> ReputationsRaw { get; set; }
        [JsonProperty(Order = 6)]
        public SortedDictionary<int, WowReputationTier> ReputationTiers { get; set; }
        [JsonProperty(Order = 7)]
        public Dictionary<int, List<List<int>>> Talents { get; set; }

        [JsonProperty(Order = 10)]
        public List<List<OutCollectionCategory>> MountSetsRaw { get; set; }
        [JsonProperty(Order = 11)]
        public SortedDictionary<int, int> SpellToMount { get; set; }
        
        [JsonProperty(Order = 20)]
        public List<List<OutCollectionCategory>> PetSetsRaw { get; set; }
        [JsonProperty(Order = 21)]
        public SortedDictionary<int, int> CreatureToPet { get; set; }

        [JsonProperty(Order = 30)]
        public List<DataReputationCategory> ReputationSets { get; set; }

        [JsonProperty(Order = 40)]
        public List<List<OutCollectionCategory>> ToySetsRaw { get; set; }

        [JsonProperty(Order = 50)]
        public List<List<OutZoneMapCategory>> ZoneMapSets { get; set; }

        [JsonProperty(Order = 100)]
        public Dictionary<int, OutRaiderIoScoreTiers> RaiderIoScoreTiers { get; set; }
    }
}
