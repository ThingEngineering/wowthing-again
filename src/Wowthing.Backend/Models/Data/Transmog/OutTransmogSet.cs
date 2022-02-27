using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Transmog
{
    [JsonConverter(typeof(OutTransmogSetConverter))]
    public class OutTransmogSet
    {
        public int WowheadSetId { get; set; }
        public string Name { get; set; }
        public Dictionary<string, List<int>> Items { get; set; }

        public OutTransmogSet(DataTransmogSet set)
        {
            WowheadSetId = set.WowheadSetId;
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
