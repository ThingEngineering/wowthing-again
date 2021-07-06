using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataReputationTiers
    {
        public List<ApiDataReputationTiersTier> Tiers { get; set; }
    }

    public class ApiDataReputationTiersTier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonProperty("min_value")]
        public int MinValue { get; set; }
        [JsonProperty("max_value")]
        public int MaxValue { get; set; }
    }
}
