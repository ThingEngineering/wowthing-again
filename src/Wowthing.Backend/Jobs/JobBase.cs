using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Serilog;
using StackExchange.Redis;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IJob
    {
        private const string API_URL = "https://{0}.api.blizzard.com/{1}";
        private readonly TimeSpan CACHE_TIME = TimeSpan.FromMinutes(60);

        internal HttpClient _http;
        internal JobRepository _jobRepository;
        internal ILogger _logger;
        internal IConnectionMultiplexer _redis;
        internal StateService _stateService;
        internal WowDbContext _context;

        private static readonly Dictionary<ApiNamespace, string> _namespaceToString = EnumUtilities.GetValues<ApiNamespace>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        private static readonly Dictionary<WowRegion, string> _regionToString = EnumUtilities.GetValues<WowRegion>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        private static readonly Dictionary<WowRegion, string> _regionToLocale = new Dictionary<WowRegion, string>
        {
            { WowRegion.US, "en_US" },
            { WowRegion.EU, "en_GB" },
            { WowRegion.KR, "ko_KR" },
            { WowRegion.TW, "zh_TW" },
        };

        protected JobBase()
        {
        }

        #region IJob
        public abstract Task Run(params string[] data);
        #endregion

        protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(API_URL, _regionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = _regionToLocale[region];
            query["namespace"] = $"{ _namespaceToString[lamespace] }-{ _regionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }

        protected async Task<T> GetJson<T>(Uri uri, bool needsAuthorization = true, bool useCache = false)
        {
            var timer = new JankTimer();

            // Try from cache first
            var cacheKey = $"getjson:{uri.ToString().Md5()}";
            var db = _redis.GetDatabase();
            string contentString = await db.StringGetAsync(cacheKey);
            if (string.IsNullOrEmpty(contentString))
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, uri);

                if (needsAuthorization)
                {
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _stateService.AccessToken.AccessToken);
                }

                var response = await _http.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    response.Content?.Dispose();
                    throw new HttpRequestException(((int)response.StatusCode).ToString());
                }

                contentString = await response.Content.ReadAsStringAsync();
                await db.StringSetAsync(cacheKey, contentString, CACHE_TIME);
                timer.AddPoint("API");
            }
            else
            {
                timer.AddPoint("Cache");
            }

            T obj = JsonConvert.DeserializeObject<T>(contentString);
            timer.AddPoint("JSON", true);
            _logger.Debug("{0}", timer.ToString());

            return obj;
        }
    }
}
