using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class UserApi
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<int, UserApiAccount> Accounts { get; set; }

        public List<UserApiCharacter> Characters { get; set; }

        public Dictionary<int, WowPeriod> CurrentPeriod { get; set; }

        public Dictionary<string, int> Mounts { get; set; }
        public Dictionary<int, int> Toys { get; set; }
    }
}
