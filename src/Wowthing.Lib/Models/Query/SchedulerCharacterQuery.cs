using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query
{
    [Keyless]
    public class SchedulerCharacterQuery
    {
        public long UserId { get; set; }
        public int? AccountId { get; set; }
        public WowRegion Region { get; set; }
        public string RealmSlug { get; set; }
        public int CharacterId { get; set; }
        public string CharacterName { get; set; }
    }
}
