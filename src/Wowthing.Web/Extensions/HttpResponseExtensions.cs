using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Wowthing.Web.Extensions;

public static class HttpResponseExtensions
{
    public static void AddPrivateApiCacheHeaders(this HttpResponse response, DateTimeOffset lastModified)
    {
        var responseHeaders = response.GetTypedHeaders();
        responseHeaders.CacheControl = new CacheControlHeaderValue
        {
            MaxAge = TimeSpan.FromSeconds(55),
            Private = true,
            MaxStale = true,
            MaxStaleLimit = TimeSpan.FromHours(24),
        };
        responseHeaders.LastModified = lastModified;
    }
}
