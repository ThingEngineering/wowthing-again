using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class DataTransmogCategory
    {
        public string Name { get; set; }
        public List<string> SkipClasses { get; set; }
        public List<DataTransmogGroup> Groups { get; set; }
    }
}
