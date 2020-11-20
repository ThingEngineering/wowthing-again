using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        [JsonProperty(Order = 0)]
        public SortedDictionary<int, WowClass> Class { get; set; }
        [JsonProperty(Order = 1)]
        public SortedDictionary<int, WowRace> Race { get; set; }
        [JsonProperty(Order = 2)]
        public SortedDictionary<int, WowRealm> Realm { get; set; }
    }
}
