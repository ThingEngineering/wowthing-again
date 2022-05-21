namespace Wowthing.Backend.Models.Data.Progress
{
    public class DataProgressGroup
    {
        public string Icon { get; set; }
        public string IconText { get; set; }
        public string Lookup { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public Dictionary<string, List<DataProgressData>> Data { get; set; }
    }
}
