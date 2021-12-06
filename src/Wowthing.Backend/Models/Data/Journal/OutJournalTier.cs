using System.Collections.Generic;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalTier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<OutJournalInstance> Instances { get; set; } = new();

        public string Slug => Name.Slugify();
    }
}
