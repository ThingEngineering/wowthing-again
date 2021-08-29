using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogCategory
    {
        public string Name { get; }
        public List<string> SkipClasses { get; }
        public List<OutTransmogGroup> Groups { get; }

        public string Slug => Name.Slugify();

        public OutTransmogCategory(DataTransmogCategory category)
        {
            Name = category.Name;
            SkipClasses = category.SkipClasses.EmptyIfNull();
            Groups = category.Groups
                .EmptyIfNull()
                .Select(group => new OutTransmogGroup(group))
                .ToList();
        }
    }
}
