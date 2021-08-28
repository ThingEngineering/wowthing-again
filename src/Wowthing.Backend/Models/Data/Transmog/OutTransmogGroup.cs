using System.Collections.Generic;
using System.Linq;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogGroup
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public Dictionary<string, List<OutTransmogSet>> Data { get; set; }
        public List<string> Sets { get; set; }

        public OutTransmogGroup(DataTransmogGroup group)
        {
            Name = group.Name;
            Type = group.Type;

            if (group.Data != null)
            {
                Data = group.Data
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value
                            .Select(set => new OutTransmogSet(set))
                            .ToList()
                    );
            }

            Sets = group.Sets;
        }
    }
}
