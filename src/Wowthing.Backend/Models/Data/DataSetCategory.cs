using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data
{
    public class DataSetCategory
    {
        public string Name { get; set; }
        public List<DataSetGroup> Groups { get; set; }
    }
}
