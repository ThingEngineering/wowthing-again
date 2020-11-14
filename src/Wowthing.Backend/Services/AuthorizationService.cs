using Microsoft.Extensions.Hosting;
using Serilog;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Services
{
    public sealed class AuthorizationService : TimerService
    {
        public RedisAccessToken AccessToken = null;

        private readonly IConnectionMultiplexer _redis;

        public AuthorizationService(IConnectionMultiplexer redis)
            : base("Authorize", TimeSpan.FromSeconds(0), TimeSpan.FromHours(1))
        {
            _redis = redis;
        }

        protected override async void TimerCallback(object state)
        {
            if (AccessToken?.RefreshRequired == false)
            {
                _logger.Debug("Token is fine {token}", AccessToken);
                return;
            }

            //_logger.Information("Retrieving OAuth token");

            // Try fetching from Redis
            var db = _redis.GetDatabase();
            var token = await db.GetJson<RedisAccessToken>("access_token:backend");
            _logger.Debug("Redis token: {token}", token);

            if (token?.RefreshRequired == false)
            {
                AccessToken = token;
                _logger.Debug("Retrieved access token from Redis {token}", AccessToken);
                return;
            }

            // Try fetching from API
        }
    }
}
