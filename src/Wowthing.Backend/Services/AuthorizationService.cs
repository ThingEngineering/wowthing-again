using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Services
{
    public sealed class AuthorizationService : TimerService
    {
        private readonly HttpClient _http = new HttpClient();
        private readonly StateService _stateService;
        private readonly IConnectionMultiplexer _redis;
        private readonly IOptions<BattleNetOptions> _bnetOptions;

        private const string REDIS_KEY_TOKEN = "access_token:backend";

        public AuthorizationService(StateService stateService, IConnectionMultiplexer redis, IOptions<BattleNetOptions> bnetOptions)
            : base("Authorize", TimeSpan.FromSeconds(0), TimeSpan.FromHours(1))
        {
            _stateService = stateService;
            _redis = redis;
            _bnetOptions = bnetOptions;
        }

        protected override async void TimerCallback(object state)
        {
            // Try fetching from Redis
            var db = _redis.GetDatabase();
            var redisToken = await db.JsonGetAsync<RedisAccessToken>(REDIS_KEY_TOKEN);

            if (redisToken?.Valid == true)
            {
                _stateService.AccessToken = redisToken;
                _logger.Debug("Retrieved valid access token from Redis");
                return;
            }

            // Try fetching from API
            var request = new HttpRequestMessage(HttpMethod.Post, "https://us.battle.net/oauth/token");

            var bytes = new UTF8Encoding().GetBytes($"{_bnetOptions.Value.ClientID}:{_bnetOptions.Value.ClientSecret}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(bytes));

            request.Content = new FormUrlEncodedContent(new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            });

            using var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var apiToken = JsonConvert.DeserializeObject<ApiAccessToken>(content);
            _logger.Debug("API token: {@token}", apiToken);

            // Save to Redis
            _stateService.AccessToken = new RedisAccessToken(apiToken);
            await db.JsonSetAsync(REDIS_KEY_TOKEN, _stateService.AccessToken);

            _logger.Information("Retrieved valid access token from API");
        }
    }
}
