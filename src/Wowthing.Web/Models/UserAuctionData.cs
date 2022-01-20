using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models
{
    public class UserAuctionData
    {
        public Dictionary<int, string> ItemNames { get; set; }
        public Dictionary<int, string> MountNames { get; set; }
        public Dictionary<int, string> PetNames { get; set; }
        public Dictionary<int, List<WowAuction>> MissingMounts { get; set; }
        public Dictionary<int, List<WowAuction>> MissingPets { get; set; }
        public Dictionary<int, List<WowAuction>> MissingToys { get; set; }
    }
}
