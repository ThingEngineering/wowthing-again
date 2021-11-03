using System;
using System.Collections.Generic;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Progress
{
    public class DataProgress : ICloneable, IDataCategory
    {
        public string Name { get; set; }
        public List<DataProgressGroup> Groups { get; set; }
        
        public string Slug => Name.Slugify();
        
        public object Clone()
        {
            return new DataProgress
            {
                Name = Name,
                Groups = Groups,
            };
        }
    }
}
