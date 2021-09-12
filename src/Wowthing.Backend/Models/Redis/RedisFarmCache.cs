using System.Collections.Generic;
using Wowthing.Backend.Models.Data.Farms;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisFarmCache
    {
        public List<List<OutFarmCategory>> Sets { get; set; }
    }
}
