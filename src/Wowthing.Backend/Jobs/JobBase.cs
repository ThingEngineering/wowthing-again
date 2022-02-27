using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Wow;
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
            { WowRegion.US, "en_US" },
            { WowRegion.EU, "en_GB" },
            { WowRegion.KR, "ko_KR" },
            { WowRegion.TW, "zh_TW" },
        };

        #region IJob
        public abstract Task Run(params string[] data);
        #endregion

        protected IDisposable AuctionLog(WowRealm realm)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{jobName} {realm.Region.ToString()} {realm.ConnectedRealmId}");
        }
        
        protected IDisposable CharacterLog(SchedulerCharacterQuery query)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{query.RealmSlug}/{query.CharacterName.ToLower()} {jobName}");
        }

        protected IDisposable UserLog(string userId)
        {
            var jobName = this.GetType().Name[0..^3];
            return LogContext.PushProperty("Task", $"{userId} {jobName}");
        }

        protected IDisposable UserLog(long userId) => UserLog(userId.ToString());

        protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(ApiUrl, RegionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = RegionToLocale[region];
            query["namespace"] = $"{ NamespaceToString[lamespace] }-{ RegionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }

        protected static Uri GenerateUri(SchedulerCharacterQuery query, string path, params string[] formatExtra)
        {
            var formatParams = new[] {query.RealmSlug, query.CharacterName.ToLower()}.Concat(formatExtra).ToArray();
            var filledPath = string.Format(path, formatParams);
            return GenerateUri(query.Region, ApiNamespace.Profile, filledPath);
        }

        protected async Task<JobHttpResult<T>> GetJson<T>(
            Uri uri,
            bool useAuthorization = true,
            bool useLastModified = true,
            JankTimer timer = null
        )
        {
            bool timerOutput = false;
            if (timer == null)
            {
                timer = new JankTimer();
                timerOutput = true;
            }
            
            var result = await GetBytes(uri, useAuthorization, useLastModified, timer);
            if (result.NotModified)
            {
                return new JobHttpResult<T> { NotModified = true };
            }
            
            var obj = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(result.Data));
            timer.AddPoint("JSON");

            if (timerOutput)
            {
                Logger.Debug("{0}", timer.ToString());
            }
            
            return new JobHttpResult<T> { Data = obj };
        }
        
        protected async Task<JobHttpResult<byte[]>> GetBytes(
            Uri uri,
            bool useAuthorization = true,
            bool useLastModified = true,
            JankTimer timer = null
        )
        {
            bool timerOutput = false;
            if (timer == null)
            {
                timer = new JankTimer();
                timerOutput = true;
            }

            var db = Redis.GetDatabase();

            // Try from cache first
            string cacheKey = string.Format(CacheKeyLastModified, uri.ToString().Md5());
            DateTime lastModified = DateTime.MinValue;
            if (useLastModified)
            {
                var value = await db.StringGetAsync(cacheKey);
                if (value.HasValue)
                {
                    lastModified = DateTime.Parse(value.ToString());
                }
            }

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
                return new JobHttpResult<byte[]> { NotModified = true };
            }

            if (!response.IsSuccessStatusCode)
            {
                response.Content?.Dispose();
                throw new HttpRequestException(((int)response.StatusCode).ToString());
            }

            var bytes = await response.Content.ReadAsByteArrayAsync(CancellationToken);

            timer.AddPoint("API");

            if (useLastModified && response.Content.Headers.LastModified.HasValue)
            {
                await db.StringSetAsync(cacheKey, response.Content.Headers.LastModified.Value.UtcDateTime.ToString("O"));
                timer.AddPoint("Cache");
            }
            
            if (timerOutput)
            {
                Logger.Debug("{0}", timer.ToString());
            }

            return new JobHttpResult<byte[]> { Data = bytes };
        }

        protected void LogNotModified()
        {
            Logger.Debug("304 Not Modified");
        }
    }
}
