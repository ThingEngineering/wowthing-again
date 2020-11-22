using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
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
            ExpiresAt = DateTime.UtcNow.AddSeconds(apiToken.ExpiresIn);
        }

        private bool? _valid = null;
        [JsonIgnore]
        public bool Valid
        {
            get
            {
                if (_valid == null)
                {
                    _valid = ExpiresAt.Subtract(DateTime.UtcNow) >= MINIMUM_REMAINING;
                }
                return _valid.Value;
            }
        }
    }
}
