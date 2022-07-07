using System.Diagnostics;
using System.Net.Http;
using Decepticon.RateLimit;
using StackExchange.Redis;

namespace Wowthing.Backend.Utilities
{
    public class RateLimitHttpMessageHandler : DelegatingHandler
    {
        private readonly RateLimiter _rateLimiter;
        private readonly int _perSecond;

        public RateLimitHttpMessageHandler(IConnectionMultiplexer redis, int perSecond)
        {
            _rateLimiter = new RateLimiter(redis.GetDatabase());
            _perSecond = perSecond;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Debug.Assert(request.RequestUri != null);
            
            int backoff = 100;
            var limitRequest = new ThrottleRateLimitRequest
            {
                Key = request.RequestUri.Host,
                Capacity = _perSecond, // max burst
                RefillRate = _perSecond, // per second refill
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

                if (backoff >= 5000)
                {
                    throw new TimeoutException("Giving up, rate limiter is sad");
                } 
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
