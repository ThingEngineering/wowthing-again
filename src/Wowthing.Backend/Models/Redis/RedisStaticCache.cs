using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        [JsonProperty(Order = 0)]
        public SortedDictionary<int, WowRealm> Realms { get; set; }
        [JsonProperty(Order = 1)]
        public SortedDictionary<int, WowReputation> Reputations { get; set; }
        [JsonProperty(Order = 2)]
        public SortedDictionary<int, WowReputationTier> ReputationTiers { get; set; }

        [JsonProperty(Order = 10)]
        public List<List<RedisSetCategory>> MountSets { get; set; }
        [JsonProperty(Order = 11)]
        public SortedDictionary<int, int> SpellToMount { get; set; }
        
        [JsonProperty(Order = 20)]
        public List<List<RedisSetCategory>> PetSets { get; set; }
        [JsonProperty(Order = 21)]
        public SortedDictionary<int, int> CreatureToPet { get; set; }

        [JsonProperty(Order = 30)]
        public List<DataReputationCategory> ReputationSets { get; set; }

        [JsonProperty(Order = 40)]
        public List<List<RedisSetCategory>> ToySets { get; set; }

        [JsonProperty(Order = 100)]
        public List<ApiDataRaiderIoScoreTier> RaiderIoScoreTiers { get; set; }
    }
}
