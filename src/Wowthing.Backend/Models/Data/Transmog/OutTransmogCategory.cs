using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogCategory : ICloneable
    {
        public string Name { get; set; }
        public List<string> SkipClasses { get; set; }
        public List<OutTransmogGroup> Groups { get; set; }

        public string Slug => Name.Slugify();

        public OutTransmogCategory()
        { }
        
        public OutTransmogCategory(DataTransmogCategory category)
        {
            Name = category.Name;
            SkipClasses = category.SkipClasses.EmptyIfNull();
            Groups = category.Groups
                .EmptyIfNull()
                .Select(group => new OutTransmogGroup(group))
                .ToList();
        }

        public object Clone()
        {
            return new OutTransmogCategory
            {
                Name = (string)Name.Clone(),
                // We don't have to change these, reference is fine
                SkipClasses = SkipClasses,
                Groups = Groups,
            };
        }
    }
}
