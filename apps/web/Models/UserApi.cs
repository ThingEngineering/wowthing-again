﻿using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Global;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models
{
    public class UserApi
    {
        public DateTime? LastApiCheck { get; set; }
        public bool Public { get; init; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<int, UserApiAccount> Accounts { get; init; }

        public List<UserApiCharacter> Characters { get; init; }

        public Dictionary<int, BackgroundImage> Backgrounds { get; set; }
        public Dictionary<int, WowPeriod> CurrentPeriod { get; init; }
        public Dictionary<string, GlobalDailies> GlobalDailies { get; set; }
        public Dictionary<int, string> GlobalDailyItems { get; set; }
        public Dictionary<string, string> Images { get; set; }

        public Dictionary<int, bool> AddonMounts { get; set; }

        [JsonProperty(PropertyName = "petsRaw")]
        public Dictionary<int, List<UserPetDataPet>> Pets { get; set; }

        public string MountsPacked { get; init; }
        public string ToysPacked { get; init; }
    }
}
