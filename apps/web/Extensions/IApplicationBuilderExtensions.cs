using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Wowthing.Web.Extensions;

public static class ApplicationBuilderExtensions
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromDays(365);

    public static IApplicationBuilder UseStaticFilesWithCaching(this IApplicationBuilder app)
    {
        return app.UseStaticFiles(new StaticFileOptions()
        {
            OnPrepareResponse = (ctx) =>
            {
                var headers = ctx.Context.Response.GetTypedHeaders();
                headers.CacheControl = new CacheControlHeaderValue
                {
                    Public = true,
                    MaxAge = CacheDuration,
                };
            }
        });
    }
}