using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data
{
    public class DataReputationCategory
    {
        public string Name { get; set; }
        public List<List<DataReputationSet>> Reputations { get; set; }

        public string Slug => Name.Slugify();
    }

    public class DataReputationSet
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DataReputation Both { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DataReputation Alliance { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DataReputation Horde { get; set; }

        public bool Paragon { get; set; } = false;
    }

    public class DataReputation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Note { get; set; }
    }
}
