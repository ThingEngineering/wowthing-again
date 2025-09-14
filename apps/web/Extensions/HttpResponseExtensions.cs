using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Wowthing.Web.Extensions;

public static class HttpResponseExtensions
{
    private static readonly TimeSpan LongPublicCacheTime = TimeSpan.FromDays(30);
    private static readonly TimeSpan PrivateCacheTime = TimeSpan.FromSeconds(5);
    private static readonly TimeSpan PublicCacheTime = TimeSpan.FromSeconds(60);
    private static readonly TimeSpan StaleCacheTime = TimeSpan.FromHours(24);

    public static void AddApiCacheHeaders(this HttpResponse response, bool isPublic, DateTimeOffset lastModified)
    {
        var responseHeaders = response.GetTypedHeaders();
        responseHeaders.CacheControl = new CacheControlHeaderValue
        {
            MaxAge = isPublic ? PublicCacheTime : PrivateCacheTime,
            Private = !isPublic,
            MaxStale = true,
            MaxStaleLimit = StaleCacheTime,
        };
        responseHeaders.LastModified = lastModified;
    }

    public static void AddLongApiCacheHeaders(this HttpResponse response, DateTimeOffset lastModified, bool isPrivate = false)
    {
        var responseHeaders = response.GetTypedHeaders();
        responseHeaders.CacheControl = new CacheControlHeaderValue
        {
            MaxAge = LongPublicCacheTime,
            Private = isPrivate,
        };
        responseHeaders.LastModified = lastModified;
    }
}
