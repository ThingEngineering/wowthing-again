using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Uploads
{
    public class Upload
    {
        public int Version { get; set; }
        public string BattleTag { get; set; }

        [JsonProperty("chars")]
        public Dictionary<string, UploadCharacter> Characters { get; set; }
        public List<int> Toys { get; set; }
    }
}
