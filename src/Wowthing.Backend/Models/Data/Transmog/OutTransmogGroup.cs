namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogGroup
    {
        public string Name { get; }
        public string Tag { get; }
        public string Type { get; }
        
        [JsonProperty(PropertyName = "dataRaw")]
        public Dictionary<string, List<OutTransmogSet>> Data { get; }
        
        public List<string> Sets { get; }

        public OutTransmogGroup(DataTransmogGroup group)
        {
            Name = group.Name;
            Tag = group.Tag;
            Type = group.Type;

            Data = group.Data
                .EmptyIfNull()
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value
                        .Select(set => new OutTransmogSet(set))
                        .ToList()
                );

            Sets = group.Sets.EmptyIfNull();
        }
    }
}
