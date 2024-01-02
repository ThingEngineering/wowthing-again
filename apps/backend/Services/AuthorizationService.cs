using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.Redis;
using Wowthing.Backend.Services.Base;

namespace Wowthing.Backend.Services;

public sealed class AuthorizationService : TimerService
{
    private readonly HttpClient _http = new HttpClient();
    private readonly StateService _stateService;
    private readonly IConnectionMultiplexer _redis;
    private readonly IOptions<BattleNetOptions> _bnetOptions;

    private const string RedisKeyToken = "access_token:backend";

    public AuthorizationService(StateService stateService, IConnectionMultiplexer redis, IOptions<BattleNetOptions> bnetOptions)
        : base("Authorize", TimeSpan.FromSeconds(0), TimeSpan.FromHours(1))
    {
        _stateService = stateService;
        _redis = redis;
        _bnetOptions = bnetOptions;
    }

    protected override async void TimerCallback(object state)
    {
        try
        {
            // Try fetching from Redis
            var db = _redis.GetDatabase();
            var redisToken = await db.JsonGetAsync<RedisAccessToken>(RedisKeyToken);

            if (redisToken?.Valid == true)
            {
                _stateService.AccessToken = redisToken;
                Logger.Debug("Retrieved valid access token from Redis");
                return;
            }

            // Try fetching from API
            var request = new HttpRequestMessage(HttpMethod.Post, "https://us.battle.net/oauth/token");

            var bytes = new UTF8Encoding().GetBytes(
                $"{_bnetOptions.Value.ClientId}:{_bnetOptions.Value.ClientSecret}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(bytes));

            request.Content = new FormUrlEncodedContent(new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            });

            using var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var apiToken = JsonSerializer.Deserialize<ApiAccessToken>(content);
            Logger.Debug("API token: {@token}", apiToken);

            // Save to Redis
            _stateService.AccessToken = new RedisAccessToken(apiToken);
            await db.JsonSetAsync(RedisKeyToken, _stateService.AccessToken);

            Logger.Information("Retrieved valid access token from API");
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
        }
    }
}
