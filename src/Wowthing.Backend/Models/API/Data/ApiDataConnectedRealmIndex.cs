using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataConnectedRealmIndex
    {
        [JsonProperty("connected_realms")]
        public List<ApiObnoxiousHref> ConnectedRealms { get; set; }
    }
}
