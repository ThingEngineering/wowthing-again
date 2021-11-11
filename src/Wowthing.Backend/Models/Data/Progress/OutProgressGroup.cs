using System.Collections.Generic;
using System.Linq;

namespace Wowthing.Backend.Models.Data.Progress
{
    public class OutProgressGroup
    {
        public string Icon { get; set; }
        public string Lookup { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public Dictionary<string, List<OutProgressData>> Data { get; set; }

        public OutProgressGroup(DataProgressGroup data)
        {
            Icon = data.Icon;
            Lookup = data.Lookup;
            Name = data.Name;
            Type = data.Type;
            Data = data.Data
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value
                        .Select(v => new OutProgressData(v))
                        .ToList()
                );
        }
    }
}
