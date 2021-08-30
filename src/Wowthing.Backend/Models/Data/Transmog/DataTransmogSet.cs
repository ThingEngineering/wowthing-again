using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class DataTransmogSet
    {
        public int WowheadSetId { get; set; }
        public string Name { get; set; }
        public Dictionary<string, string> Items { get; set; }
    }
}
