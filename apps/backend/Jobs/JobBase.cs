using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using Polly.RateLimit;
using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs;

public abstract class JobBase : IJob, IDisposable
{
    private const string ApiUrl = "https://{0}.api.blizzard.com/{1}";
    private const string CacheKeyLastModified = "last_modified:{0}";

    internal CacheService CacheService;
    internal CancellationToken CancellationToken;
    internal HttpClient Http;
    internal IConnectionMultiplexer Redis;
    internal IDbContextFactory<WowDbContext> ContextFactory { get; set; }
    internal ILogger Logger;
    internal JobRepository JobRepository;
    internal JsonSerializerOptions JsonSerializerOptions;
    internal MemoryCacheService MemoryCacheService;
    internal StateService StateService;

    private static readonly Dictionary<ApiNamespace, string> NamespaceToString = EnumUtilities.GetValues<ApiNamespace>()
        .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
    private static readonly Dictionary<WowRegion, string> RegionToString = EnumUtilities.GetValues<WowRegion>()
        .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
    private static readonly Dictionary<WowRegion, string> RegionToLocale = new()
    {
        { WowRegion.US, "en_US" },
        { WowRegion.EU, "en_GB" },
        { WowRegion.KR, "ko_KR" },
        { WowRegion.TW, "zh_TW" },
    };

    private WowDbContext _context;
    internal WowDbContext Context => _context ??= ContextFactory.CreateDbContext();

    #region IJob
    public abstract Task Run(string[] data);
    #endregion

    protected IDisposable AuctionLog(WowRegion region, int connectedRealmId)
    {
        var jobName = this.GetType().Name[0..^3];
        return LogContext.PushProperty("Task", $"{jobName} {region.ToString()} {connectedRealmId}");
    }

    protected IDisposable CharacterLog(SchedulerCharacterQuery query)
    {
        var jobName = this.GetType().Name[0..^3];
        return LogContext.PushProperty("Task", $"{query.Region}/{query.RealmSlug}/{query.CharacterName.ToLower()} {jobName}");
    }

    protected IDisposable UserLog(string userId)
    {
        var jobName = this.GetType().Name[0..^3];
        return LogContext.PushProperty("Task", $"{userId} {jobName}");
    }

    protected IDisposable UserLog(long userId) => UserLog(userId.ToString());

    protected IDisposable QuestLog(int questId)
    {
        var jobName = this.GetType().Name[0..^3];
        return LogContext.PushProperty("Task", $"{jobName} {questId}");
    }

    protected SchedulerCharacterQuery DeserializeCharacterQuery(string data)
    {
        var query = System.Text.Json.JsonSerializer.Deserialize<SchedulerCharacterQuery>(data, JsonSerializerOptions);
        if (query == null)
        {
            throw new InvalidJsonException(data);
        }

        return query;
    }

    protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path, string locale = null)
    {
        var builder = new UriBuilder(string.Format(ApiUrl, RegionToString[region], path));
        var query = HttpUtility.ParseQueryString(builder.Query);
        query["locale"] = !string.IsNullOrEmpty(locale) ? locale : RegionToLocale[region];
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
        DateTime? lastModified = null,
        JankTimer timer = null
    )
    {
        bool timerOutput = false;
        if (timer == null)
        {
            timer = new JankTimer();
            timerOutput = true;
        }

        var result = await GetBytes(uri, useAuthorization, useLastModified, lastModified, timer);
        if (result.NotModified)
        {
            return new JobHttpResult<T> { NotModified = true };
        }

        string jsonString = Encoding.UTF8.GetString(result.Data);
        var obj = System.Text.Json.JsonSerializer.Deserialize<T>(jsonString, JsonSerializerOptions);
        timer.AddPoint("JSON");

        if (timerOutput)
        {
            Logger.Debug("{0}", timer.ToString());
        }

        return new JobHttpResult<T>
        {
            Data = obj,
            LastModified = result.LastModified,
        };
    }

    protected async Task<JobHttpResult<byte[]>> GetBytes(
        Uri uri,
        bool useAuthorization = true,
        bool useLastModified = true,
        DateTime? lastModified = null,
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
        bool useProvidedLastModified = lastModified != null;
        string cacheKey = string.Format(CacheKeyLastModified, uri.ToString().Md5());
        if (useLastModified && !useProvidedLastModified)
        {
            var value = await db.StringGetAsync(cacheKey);
            if (value.HasValue)
            {
                lastModified = DateTime.Parse(value.ToString());
            }
        }

        HttpResponseMessage response;
        while (true)
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, uri);

            if (useAuthorization)
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", StateService.AccessToken.AccessToken);
            }
            if (lastModified > MiscConstants.DefaultDateTime)
            {
                request.Headers.IfModifiedSince = new DateTimeOffset(lastModified.Value);
            }

            try
            {
                response = await Http.SendAsync(request, CancellationToken);
                break;
            }
            catch (RateLimitRejectedException ex)
            {
                // Logger.Debug("Rate-limited, waiting {retry}", ex.RetryAfter);
                await Task.Delay(ex.RetryAfter, CancellationToken);
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

        if (response.Content.Headers.LastModified.HasValue)
        {
            lastModified = response.Content.Headers.LastModified.Value.UtcDateTime;
            if (useLastModified && !useProvidedLastModified)
            {
                await db.StringSetAsync(cacheKey, lastModified.Value.ToString("O"));
            }
        }

        response.Content.Dispose();

        if (timerOutput)
        {
            Logger.Debug("{0}", timer.ToString());
        }

        return new JobHttpResult<byte[]>
        {
            Data = bytes,
            LastModified = lastModified ?? MiscConstants.DefaultDateTime,
        };
    }

    protected void LogNotModified()
    {
        Logger.Debug("304 Not Modified");
    }

    public void Dispose()
    {
        Http?.Dispose();
        //Redis?.Dispose();
        _context?.Dispose();
    }
}
