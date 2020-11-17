using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Serilog;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Profile;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs
{
    public class UserCharactersJob : JobBase
    {
        private const string API_PATH = "profile/user/wow?access_token={0}";

        public UserCharactersJob(HttpClient http, ILogger logger, UserRepository userRepository) : base(http, logger, userRepository)
        {
        }

        public override async Task Run(params string[] data)
        {
            var userId = long.Parse(data[0]);
            var accessToken = await _userRepository.GetAccessTokenByUserId(userId);
            if (accessToken == null)
            {
                _logger.Error("No access_token for user {0}", userId);
                return;
            }

            var path = string.Format(API_PATH, accessToken);
            // TODO don't hardcode region
            var uri = GenerateUri(ApiRegion.US, ApiNamespace.Profile, path);
            _logger.Debug("token={0} uri={1}", accessToken, uri.ToString());
            _http.DefaultRequestHeaders.Authorization = null;
            var response = await _http.GetAsync(uri);
            response.EnsureSuccessStatusCode();
            _logger.Debug("hi?");

            var profile = await response.DeserializeJsonAsync<ApiAccountProfile>();

            _logger.Debug("UserCharactersJob: {@profile}", profile);
        }
    }
}
