using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class OutVendorGroup
    {
        public string Name { get; set; }
        public FarmDropType Type { get; set; }
        public List<OutVendorItem> Things { get; set; }

        public OutVendorGroup(DataVendorGroup group)
        {
            Name = group.Name;
            Type = Enum.Parse<FarmDropType>(group.Type, true);
            Things = group.Things
                .EmptyIfNull()
                .Select(item => new OutVendorItem(item))
                .ToList();
        }
    }
}
