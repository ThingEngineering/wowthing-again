using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacter
    {
        public long Id { get; set; }

        [JsonProperty("average_item_level")]
        public int AverageItemLevel { get; set; }

        [JsonProperty("equipped_item_level")]
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
        
        [JsonProperty("covenant_progress")]
        public ApiCharacterCovenantProgress CovenantProgress { get; set; } 
    }

    public class ApiCharacterCovenantProgress
    {
        [JsonProperty("chosen_covenant")]
        public ApiObnoxiousObject ChosenCovenant { get; set; }
        
        public Dictionary<string, string> Soulbinds { get; set; }
    }
}
