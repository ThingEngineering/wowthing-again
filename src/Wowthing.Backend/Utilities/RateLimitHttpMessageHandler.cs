using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Decepticon.RateLimit;
using StackExchange.Redis;

namespace Wowthing.Backend
{
    public class RateLimitHttpMessageHandler : DelegatingHandler
    {
        private readonly RateLimiter _rateLimiter;

        public RateLimitHttpMessageHandler(IConnectionMultiplexer redis)
        {
            _rateLimiter = new RateLimiter(redis.GetDatabase());
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            int backoff = 100;
            var limitRequest = new ThrottleRateLimitRequest
            {
                Key = request.RequestUri.Host,
                Capacity = 10, // 10 max burst
                RefillRate = 10, // 10 per second refill
            };

            while (true)
            {
                var limitResult = _rateLimiter.Validate(limitRequest);
                
                if (limitResult.IsAllowed)
                {
                    break;
                }

                await Task.Delay(backoff, cancellationToken);
                backoff *= 2;

                if (backoff > 3200)
                {
                    throw new TimeoutException("Giving up, rate limiter is sad");
                } 
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
