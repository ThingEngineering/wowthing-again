using System.Collections.Generic;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounterItem
    {
        public int Id { get; set; }
        public WowQuality Quality { get; set; }
        public List<OutJournalEncounterItemAppearance> Appearances { get; set; }
   }
}
