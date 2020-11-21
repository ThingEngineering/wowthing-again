using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataTitle
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonProperty("gender_name")]
        public ApiGenderString GenderName { get; set; }
    }
}
