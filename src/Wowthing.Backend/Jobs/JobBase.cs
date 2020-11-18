using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using StackExchange.Redis;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Services;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IJob
    {
        private const string API_URL = "https://{0}.api.blizzard.com/{1}";

        protected readonly HttpClient _http;
        protected readonly ILogger _logger;

        private readonly IServiceScope _serviceScope;
        private readonly StateService _stateService;

        private static readonly Dictionary<ApiNamespace, string> _namespaceToString = EnumUtilities.GetValues<ApiNamespace>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        private static readonly Dictionary<ApiRegion, string> _regionToString = EnumUtilities.GetValues<ApiRegion>()
            .ToDictionary(k => k, v => v.ToString().ToLowerInvariant());
        private static readonly Dictionary<ApiRegion, string> _regionToLocale = new Dictionary<ApiRegion, string>
        {
            { ApiRegion.US, "en_US" },
            { ApiRegion.EU, "en_GB" },
            { ApiRegion.KR, "ko_KR" },
            { ApiRegion.TW, "zh_TW" },
        };

        protected JobBase(HttpClient http, ILogger logger, IServiceScope serviceScope)
        {
            _http = http;
            _logger = logger;
            _serviceScope = serviceScope;

            _stateService = GetService<StateService>();
        }

        #region IJob
        public abstract Task Run(params string[] data);
        #endregion

        protected T GetService<T>() => _serviceScope.ServiceProvider.GetRequiredService<T>();

        protected static Uri GenerateUri(ApiRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(API_URL, _regionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = _regionToLocale[region];
            query["namespace"] = $"{ _namespaceToString[lamespace] }-{ _regionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }

        protected async Task<T> GetJson<T>(Uri uri, bool needsAuthorization = true)
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

            return await response.DeserializeJsonAsync<T>();
        }
    }
}
