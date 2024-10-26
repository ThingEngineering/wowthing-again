using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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

    internal long UserId;
    internal int CharacterId;
    internal IDisposable LogProperty;

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

    internal Task<WowDbContext> NewContext() => ContextFactory.CreateDbContextAsync(CancellationToken);

    #region IJob
    public abstract Task Run(string[] data);

    // This runs in the WorkerService context, logging context properties set here will persist into the exception handler
    public virtual void Setup(string[] data)
    { }
    #endregion

    protected void AuctionLog(WowRegion region, int connectedRealmId)
    {
        string jobName = GetType().Name[0..^3];
        LogProperty = LogContext.PushProperty("Task", $"{jobName} {region.ToString()} {connectedRealmId}");
    }

    protected void CharacterLog(SchedulerCharacterQuery query)
    {
        string jobName = GetType().Name[0..^3];
        LogProperty = LogContext.PushProperty("Task", $"{query.Region}/{query.RealmSlug}/{query.CharacterName.ToLower()} {jobName}");
    }

    protected void UserLog(string userId)
    {
        string jobName = GetType().Name[0..^3];
        LogProperty = LogContext.PushProperty("Task", $"{userId} {jobName}");
    }

    protected void UserLog(long userId) => UserLog(userId.ToString());

    protected void QuestLog(int questId)
    {
        var jobName = GetType().Name[0..^3];
        LogProperty = LogContext.PushProperty("Task", $"{jobName} {questId}");
    }

    protected SchedulerCharacterQuery DeserializeCharacterQuery(string data)
    {
        var query = JsonSerializer.Deserialize<SchedulerCharacterQuery>(data, JsonSerializerOptions);
        if (query == null)
        {
            throw new InvalidJsonException(data);
        }

        UserId = query.UserId;
        CharacterId = query.CharacterId;

        return query;
    }

    protected static Uri GenerateUri(WowRegion region, ApiNamespace lamespace, string path, string locale = null)
    {
        var builder = new UriBuilder(string.Format(ApiUrl, RegionToString[region], path));
        var query = HttpUtility.ParseQueryString(builder.Query);
        query["locale"] = !string.IsNullOrEmpty(locale) ? locale : RegionToLocale[region];
        query["namespace"] = $"{ NamespaceToString[lamespace] }-{ RegionToString[region] }";
        builder.Query = query.ToString()!;
        return builder.Uri;
    }

    protected static Uri GenerateUri(SchedulerCharacterQuery query, string path, params string[] formatExtra)
    {
        object[] formatParams = new object[] {query.RealmSlug, query.CharacterName.ToLower()}.Concat(formatExtra).ToArray();
        string filledPath = string.Format(path, formatParams);
        return GenerateUri(query.Region, ApiNamespace.Profile, filledPath);
    }

    protected async Task<JobHttpResult<byte[]>> GetUriAsBytesAsync(
        Uri uri,
        bool useAuthorization = true,
        bool useLastModified = true,
        string overrideAccessToken = null,
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

        var result = await MakeHttpRequest(ReadBytesAsync, uri, useAuthorization, useLastModified, overrideAccessToken, lastModified, timer);

        if (timerOutput)
        {
            Logger.Debug("{0}", timer.ToString());
        }

        return result;
    }

    private async Task<byte[]> ReadBytesAsync(HttpResponseMessage response)
    {
        return await response.Content.ReadAsByteArrayAsync(CancellationToken);
    }

    protected async Task<JobHttpResult<T>> GetUriAsJsonAsync<T>(
        Uri uri,
        bool useAuthorization = true,
        bool useLastModified = true,
        string overrideAccessToken = null,
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

        var result = await MakeHttpRequest(ParseJsonAsync<T>, uri, useAuthorization, useLastModified, overrideAccessToken, lastModified, timer);

        if (timerOutput)
        {
            Logger.Debug("{0}", timer.ToString());
        }

        return result;
    }

    private async Task<T> ParseJsonAsync<T>(HttpResponseMessage response)
    {
        var contentStream = await response.Content.ReadAsStreamAsync(CancellationToken);
        return await JsonSerializer.DeserializeAsync<T>(contentStream, JsonSerializerOptions, CancellationToken);
    }

    private async Task<JobHttpResult<T>> MakeHttpRequest<T>(
        Func<HttpResponseMessage, Task<T>> resultFunc,
        Uri uri,
        bool useAuthorization = true,
        bool useLastModified = true,
        string overrideAccessToken = null,
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
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer",
                    overrideAccessToken ?? StateService.AccessToken.AccessToken);
            }
            if (lastModified > MiscConstants.DefaultDateTime)
            {
                request.Headers.IfModifiedSince = new DateTimeOffset(lastModified.Value);
            }

            try
            {
                response = await Http.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, CancellationToken);
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

                throw new HttpRequestException("Operation canceled??");
            }
        }

        if (response.StatusCode == HttpStatusCode.NotModified)
        {
            return new JobHttpResult<T> { NotModified = true };
        }

        if (!response.IsSuccessStatusCode)
        {
            response.Content?.Dispose();
            throw new HttpRequestException(((int)response.StatusCode).ToString());
        }

        timer.AddPoint("API");

        if (response.Content.Headers.LastModified.HasValue)
        {
            lastModified = response.Content.Headers.LastModified.Value.UtcDateTime;
            if (useLastModified && !useProvidedLastModified)
            {
                await db.StringSetAsync(cacheKey, lastModified.Value.ToString("O"), flags: CommandFlags.FireAndForget);
            }
        }

        var result = await resultFunc(response);

        response.Content.Dispose();

        if (timerOutput)
        {
            Logger.Debug("{0}", timer.ToString());
        }

        return new JobHttpResult<T>
        {
            Data = result,
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
        LogProperty?.Dispose();

        GC.SuppressFinalize(this);
    }

    public virtual Task Finally()
    {
        return Task.CompletedTask;
    }

    protected async Task DecrementCharacterJobs()
    {
        var db = Redis.GetDatabase();
        string characterKey = string.Format(RedisKeys.CharacterJobCounter, CharacterId);
        long value = await db.StringDecrementAsync(characterKey);

        if (value <= 0)
        {
            Logger.Debug("Character {id} job count is {value}", CharacterId, value);

            await db.KeyDeleteAsync(characterKey, CommandFlags.FireAndForget);
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, UserId);
        }
    }
}
