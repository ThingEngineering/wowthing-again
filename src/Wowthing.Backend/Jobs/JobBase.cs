using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Serilog;
using Wowthing.Backend.Models.API;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IJob
    {
        protected readonly UserRepository _userRepository;
        protected readonly HttpClient _http;
        protected readonly ILogger _logger;

        private const string API_URL = "https://{0}.api.blizzard.com/{1}";

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

        protected JobBase(HttpClient http, ILogger logger, UserRepository userRepository)
        {
            _http = http;
            _logger = logger;
            _userRepository = userRepository;
        }

        public abstract Task Run(params string[] data);

        protected static Uri GenerateUri(ApiRegion region, ApiNamespace lamespace, string path)
        {
            var builder = new UriBuilder(string.Format(API_URL, _regionToString[region], path));
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["locale"] = _regionToLocale[region];
            query["namespace"] = $"{ _namespaceToString[lamespace] }-{ _regionToString[region] }";
            builder.Query = query.ToString();
            return builder.Uri;
        }
    }
}
