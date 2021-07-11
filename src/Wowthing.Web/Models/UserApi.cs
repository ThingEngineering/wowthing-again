using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models
{
    public class UserApi
    {
        public bool Public { get; internal set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<int, UserApiAccount> Accounts { get; set; }

        [JsonIgnore]
        public Dictionary<ushort, int> AchievementsCompleted { get; set; }
        public string AchievementsWhee { get; set; }
        
        public List<UserApiCharacter> Characters { get; set; }

        public Dictionary<int, WowPeriod> CurrentPeriod { get; set; }

        public Dictionary<int, int> Mounts { get; set; }
        public Dictionary<int, int> Toys { get; set; }
    }
}
