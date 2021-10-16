using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Collections
{
    public class DataCollectionGroup
    {
        public string Name { get; set; }
        public List<string> Things { get; set; } = new();
    }
}
