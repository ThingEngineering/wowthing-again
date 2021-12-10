using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Backend.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounterItem
    {
        public int Id { get; set; }
        public int ClassMask { get; set; }
        public int ClassId { get; set; }
        public int SubclassId { get; set; }
        public WowQuality Quality { get; set; }
        public List<OutJournalEncounterItemAppearance> Appearances { get; set; }
    }
}
