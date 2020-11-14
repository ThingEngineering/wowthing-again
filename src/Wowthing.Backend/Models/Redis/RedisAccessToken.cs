using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Wowthing.Backend.Models.API;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisAccessToken
    {
        private static readonly TimeSpan MINIMUM_REMAINING = TimeSpan.FromHours(4);

        public string AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }

        public RedisAccessToken()
        { }

        public RedisAccessToken(ApiAccessToken apiToken)
        {
            AccessToken = apiToken.AccessToken;
            ExpiresAt = DateTime.Now.AddSeconds(apiToken.ExpiresIn);
        }

        [JsonIgnore]
        public bool RefreshRequired => (ExpiresAt.Subtract(DateTime.Now) <= MINIMUM_REMAINING);
    }
}
