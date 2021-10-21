using System.Collections.Generic;
using Wowthing.Backend.Models.Data.ZoneMaps;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisZoneMapCache
    {
        public List<List<OutZoneMapCategory>> Sets { get; set; }
    }
}
