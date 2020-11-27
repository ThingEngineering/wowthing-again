using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Data;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        [JsonProperty(Order = 0)]
        public SortedDictionary<int, WowClass> Classes { get; set; }
        [JsonProperty(Order = 1)]
        public SortedDictionary<int, WowRace> Races { get; set; }
        [JsonProperty(Order = 2)]
        public SortedDictionary<int, WowRealm> Realms { get; set; }
        [JsonProperty(Order = 3)]
        public SortedDictionary<int, WowReputation> Reputations { get; set; }
        [JsonProperty(Order = 4)]
        public SortedDictionary<int, WowReputationTier> ReputationTiers { get; set; }

        [JsonProperty(Order = 10)]
        public SortedDictionary<int, int> MountToSpell { get; set; }
        //[JsonProperty(Order = 11)]
        //public SortedDictionary<int, int> Pets { get; set; }

        [JsonProperty(Order = 20)]
        public List<RedisSetCategory> MountSets { get; set; }
        [JsonProperty(Order = 23)]
        public List<DataReputationCategory> ReputationSets { get; set; }
    }
}
