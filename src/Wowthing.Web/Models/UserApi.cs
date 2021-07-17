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

        public string AchievementsPacked { get; set; }
        public string MountsPacked { get; set; }
        public string ToysPacked { get; set; }
        
        public List<UserApiCharacter> Characters { get; set; }

        public Dictionary<int, WowPeriod> CurrentPeriod { get; set; }

        public Dictionary<int, int> Mounts { get; set; }
        //public Dictionary<int, int> Toys { get; set; }
    }
}
