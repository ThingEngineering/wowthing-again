using System.Collections.Generic;
using Wowthing.Backend.Models.Data.Transmog;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisTransmogCache
    {
        public List<List<OutTransmogCategory>> Sets { get; set; }
    }
}
