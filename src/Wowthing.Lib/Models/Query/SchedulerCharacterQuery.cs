using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query
{
    public class SchedulerCharacterQuery
    {
        public long UserId { get; set; }
        public WowRegion Region { get; set; }
        public string RealmSlug { get; set; }
        public long CharacterId { get; set; }
        public string CharacterName { get; set; }
        public DateTime LastModified { get; set; }
    }
}
