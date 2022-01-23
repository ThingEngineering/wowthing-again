using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Uploads
{
    public class Upload
    {
        public int Version { get; set; }
        public string BattleTag { get; set; }

        [JsonProperty("chars")]
        public Dictionary<string, UploadCharacter> Characters { get; set; }
        
        public Dictionary<string, UploadGuild> Guilds { get; set; }
        
        public List<int> Toys { get; set; }
        public Dictionary<int, Dictionary<string, bool>> TransmogSources { get; set; }
    }
}
