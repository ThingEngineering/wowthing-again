using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Backend.Models.Data
{
    public class DataSetCategory
    {
        public string Name { get; set; }
        public List<DataSetGroup> Groups { get; set; }
    }
}
