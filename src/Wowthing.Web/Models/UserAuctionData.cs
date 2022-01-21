using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models
{
    public class UserAuctionData
    {
        public Dictionary<int, List<WowAuction>> Auctions { get; set; }
        public Dictionary<int, string> Names { get; set; }
    }
}
