using System.Collections.Generic;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Progress
{
    public class DataProgress
    {
        public string Name { get; set; }
        public List<DataProgressGroup> Groups { get; set; }
        
        public string Slug => Name.Slugify();
    }
}
