using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Wowthing.Web.Models
{
    public class UserApi
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<UserApiAccount> Accounts { get; set; }
        public List<UserApiCharacter> Characters { get; set; }
    }
}
