using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IJob
    {
        private const string ApiUrl = "https://{0}.api.blizzard.com/{1}";
        private const string CacheKeyLastModified = "last_modified:{0}";

        internal HttpClient Http;
        internal JobRepository JobRepository;
        internal ILogger Logger;
        internal IConnectionMultiplexer Redis;
        internal StateService StateService;
        internal WowDbContext Context;
        internal CancellationToken CancellationToken;

        private static readonly Dictionary<ApiNamespace, string> NamespaceToString = EnumUtilities.GetValues<ApiNamespace>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        private static readonly Dictionary<WowRegion, string> RegionToString = EnumUtilities.GetValues<WowRegion>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        protected static readonly Dictionary<WowRegion, string> RegionToLocale = new Dictionary<WowRegion, string>
        {
            { WowRegion.Us, "en_US" },
            { WowRegion.Eu, "en_GB" },
            { WowRegion.Kr, "ko_KR" },
            { WowRegion.Tw, "zh_TW" },
        };

        #region IJob
        public abstract Task Run(params string[] data);
        #endregion

        protected IDisposable CharacterLog(SchedulerCharacterQuery query)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{query.RealmSlug}/{query.CharacterName.ToLowerInvariant()} {jobName}: ");
        }

        protected IDisposable UserLog(string userId)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{userId} {jobName}: ");
        }

        protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(ApiUrl, RegionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = RegionToLocale[region];
            query["namespace"] = $"{ NamespaceToString[lamespace] }-{ RegionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }

        protected async Task<JsonResult<T>> GetJson<T>(Uri uri, bool useAuthorization = true, bool useLastModified = true)
            //where T : class
        {
            var timer = new JankTimer();
            var db = Redis.GetDatabase();

            // Try from cache first
            string cacheKey = string.Format(CacheKeyLastModified, uri.ToString().Md5());
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
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", StateService.AccessToken.AccessToken);
                }
                if (lastModified > DateTime.MinValue)
                {
                    request.Headers.IfModifiedSince = new DateTimeOffset(lastModified);
                }

                HttpResponseMessage response;
                try
                {
                    response = await Http.SendAsync(request, CancellationToken);
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
            Logger.Debug("{0}", timer.ToString());

            return new JsonResult<T> { Data = obj };
        }

        protected void LogNotModified()
        {
            Logger.Debug("304 Not Modified");
        } 
    }
}
