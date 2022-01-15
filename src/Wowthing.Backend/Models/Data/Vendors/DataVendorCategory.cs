using System;
using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class DataVendorCategory : ICloneable, IDataCategory
    {
        public string Name { get; set; }
        public List<DataVendorGroup> Groups { get; set; }
        
        public object Clone()
        {
            return new DataVendorCategory
            {
                Name = (string)Name.Clone(),
                // We don't have to change these, reference is fine
                Groups = Groups,
            };
        }

    }
}
