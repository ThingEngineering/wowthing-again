using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API
{
    public class ApiObnoxiousHref
    {
        [JsonProperty("href")]
        public string Href { get; set; }
    }
}
