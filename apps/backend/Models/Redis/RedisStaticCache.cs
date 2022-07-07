﻿using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        [JsonProperty(Order = 0)]
        public Dictionary<int, List<int>> Bags { get; set; }
        
        [JsonProperty(Order = 1)]
        public List<OutCurrency> CurrenciesRaw { get; set; }
        
        [JsonProperty(Order = 2)]
        public SortedDictionary<int, OutCurrencyCategory> CurrencyCategories { get; set; }
        
        [JsonProperty(Order = 3)]
        public List<OutInstance> InstancesRaw { get; set; }

        [JsonProperty(Order = 4)]
        public Dictionary<int, OutProfession> Professions { get; set; }
        
        [JsonProperty(Order = 5)]
        public List<List<OutProgress>> Progress { get; set; }
        
        [JsonProperty(Order = 6)]
        public List<WowRealm> RealmsRaw { get; set; }
        
        [JsonProperty(Order = 7)]
        public List<OutReputation> ReputationsRaw { get; set; }
        
        [JsonProperty(Order = 8)]
        public SortedDictionary<int, WowReputationTier> ReputationTiers { get; set; }
        
        [JsonProperty(Order = 9)]
        public Dictionary<int, List<OutSoulbind>> Soulbinds { get; set; }
        
        [JsonProperty(Order = 10)]
        public Dictionary<int, List<List<int>>> Talents { get; set; }
        
        [JsonProperty(Order = 50)]
        public List<JArray> MountsRaw { get; set; }

        [JsonProperty(Order = 51)]
        public List<List<OutCollectionCategory>> MountSetsRaw { get; set; }

        [JsonProperty(Order = 60)]
        public List<JArray> PetsRaw { get; set; }

        [JsonProperty(Order = 61)]
        public List<List<OutCollectionCategory>> PetSetsRaw { get; set; }
        
        [JsonProperty(Order = 70)]
        public List<JArray> ToysRaw { get; set; }

        [JsonProperty(Order = 71)]
        public List<List<OutCollectionCategory>> ToySetsRaw { get; set; }

        [JsonProperty(Order = 100)]
        public List<DataReputationCategory> ReputationSets { get; set; }
       
        [JsonProperty(Order = 101)]
        public List<List<OutVendorCategory>> VendorSets { get; set; }

        [JsonProperty(Order = 102)]
        public List<List<OutZoneMapCategory>> ZoneMapSets { get; set; }

        [JsonProperty(Order = 103)]
        public Dictionary<int, OutRaiderIoScoreTiers> RaiderIoScoreTiers { get; set; }
    }
}
