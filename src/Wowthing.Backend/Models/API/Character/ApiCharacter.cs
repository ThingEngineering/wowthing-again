using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacter
    {
        public long Id { get; set; }

        public int AverageItemLevel { get; set; }
        
        public int EquippedItemLevel { get; set; }
        
        public int Experience { get; set; }
        
        public int Level { get; set; }

        [JsonProperty("last_login_timestamp")]
        public long LastLogout { get; set; }
        
        public string Name { get; set; }

        public ApiTypeName Gender { get; set; }
        
        public ApiTypeName Faction { get; set; }
        
        public ApiObnoxiousObject Guild { get; set; }
        
        public ApiObnoxiousObject Race { get; set; }

        public ApiObnoxiousObject Realm { get; set; }

        [JsonProperty("active_spec")]
        public ApiObnoxiousObject ActiveSpec { get; set; }

        [JsonProperty("active_title")]
        public ApiObnoxiousObject ActiveTitle { get; set; }

        [JsonProperty("character_class")]
        public ApiObnoxiousObject Class { get; set; }
    }
}
