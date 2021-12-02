using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Progress
{
    public class OutProgressData
    {
        public List<int> Ids { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Description { get; set; }
        
        public string Name { get; set; }

        public OutProgressData(DataProgressData data)
        {
            Description = data.Description;
            Name = data.Name;
            
            Ids = data.Id
                .EmptyIfNullOrWhitespace()
                .Split()
                .Select(id => int.Parse(id))
                .ToList();
        }
    }
}
