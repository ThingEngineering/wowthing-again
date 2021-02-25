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
using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IJob
    {
        private const string API_URL = "https://{0}.api.blizzard.com/{1}";
        private const string CACHE_KEY_LAST_MODIFIED = "last_modified:{0}";

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
        protected static readonly Dictionary<WowRegion, string> _regionToLocale = new Dictionary<WowRegion, string>
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

        protected IDisposable CharacterLog(SchedulerCharacterQuery query)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{query.RealmSlug}/{query.CharacterName.ToLowerInvariant()} {jobName}: ");
        }

        protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(API_URL, _regionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = _regionToLocale[region];
            query["namespace"] = $"{ _namespaceToString[lamespace] }-{ _regionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }

        protected async Task<JsonResult<T>> GetJson<T>(Uri uri, bool useAuthorization = true, bool useLastModified = true)
            //where T : class
        {
            var timer = new JankTimer();
            var db = _redis.GetDatabase();

            // Try from cache first
            string cacheKey = string.Format(CACHE_KEY_LAST_MODIFIED, uri.ToString().Md5());
            string contentString = null;
            DateTime lastModified = DateTime.MinValue;
            if (useLastModified)
            {
                var value = await db.StringGetAsync(cacheKey);
                if (value.HasValue)
                {
                    lastModified = DateTime.Parse(value.ToString());
                }
            }

            if (string.IsNullOrEmpty(contentString))
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, uri);

                if (useAuthorization)
                {
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _stateService.AccessToken.AccessToken);
                }
                if (lastModified > DateTime.MinValue)
                {
                    request.Headers.IfModifiedSince = new DateTimeOffset(lastModified);
                }

                HttpResponseMessage response;
                try
                {
                    response = await _http.SendAsync(request);
                }
                catch (OperationCanceledException ex)
                {
                    if (ex.InnerException != null)
                    {
                        throw ex.InnerException;
                    }
                    else
                    {
                        throw new HttpRequestException("Operation canceled??");
                    } 
                }

                if (response.StatusCode == HttpStatusCode.NotModified)
                {
                    return new JsonResult<T> { NotModified = true };
                }

                if (!response.IsSuccessStatusCode)
                {
                    response.Content?.Dispose();
                    throw new HttpRequestException(((int)response.StatusCode).ToString());
                }

                contentString = await response.Content.ReadAsStringAsync();

                timer.AddPoint("API");

                if (useLastModified && response.Content.Headers.LastModified.HasValue)
                {
                    await db.StringSetAsync(cacheKey, response.Content.Headers.LastModified.Value.UtcDateTime.ToString("O"));
                    timer.AddPoint("Cache");
                }
            }
            else
            {
                timer.AddPoint("Cache");
            }

            T obj = JsonConvert.DeserializeObject<T>(contentString);
            timer.AddPoint("JSON", true);
            _logger.Debug("{0}", timer.ToString());

            return new JsonResult<T> { Data = obj };
        }
    }
}
