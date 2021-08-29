using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogSet
    {
        public string Name { get; set; }
        public Dictionary<string, List<int>> Items { get; set; }

        public OutTransmogSet(DataTransmogSet set)
        {
            Name = set.Name;
            Items = set.Items
                .EmptyIfNull()
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value
                        .Trim()
                        .Split()
                        .Select(int.Parse)
                        .ToList()
                );
        }
    }
}
