using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class DataVendorGroup
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public List<DataVendorItem> Things { get; set; }
    }
}
