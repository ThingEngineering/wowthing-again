using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacterMythicKeystoneProfileSeason
    {
        [JsonProperty("best_runs")]
        public List<ApiCharacterMythicKeystoneBestRun> BestRuns { get; set; }
    }
}
