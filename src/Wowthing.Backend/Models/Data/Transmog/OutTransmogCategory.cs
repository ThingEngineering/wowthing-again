using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogCategory
    {
        public string Name { get; set; }
        public List<OutTransmogGroup> Groups { get; set; }

        public string Slug => Name.Slugify();

        public OutTransmogCategory(DataTransmogCategory category)
        {
            Name = category.Name;
            Groups = category.Groups
                .Select(group => new OutTransmogGroup(group))
                .ToList();
        }
    }
}
