namespace Wowthing.Backend.Models.Data.Transmog
{
    public class DataTransmogGroup
    {
        public string Name { get; set; }
        public string Tag { get; set; }
        public string Type { get; set; }
        public Dictionary<string, List<DataTransmogSet>> Data { get; set; }
        public List<string> Sets { get; set; }
    }
}
