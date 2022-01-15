using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class OutVendorCategory
    {
        public string Name { get; set; }
        public List<OutVendorGroup> Groups { get; set; }
        
        public string Slug => Name.Slugify();

        public OutVendorCategory(DataVendorCategory category)
        {
            Name = category.Name;
            Groups = category.Groups
                .EmptyIfNull()
                .Select(group => new OutVendorGroup(group))
                .ToList();
        }
    }
}
