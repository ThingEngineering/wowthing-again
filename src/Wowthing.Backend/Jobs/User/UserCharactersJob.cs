using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Profile;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs
{
    public class UserCharactersJob : JobBase
    {
        private const string API_PATH = "profile/user/wow?access_token={0}";
        
        private readonly UserRepository _userRepository;

        public UserCharactersJob(HttpClient http, ILogger logger, IServiceScope serviceScope) : base(http, logger, serviceScope)
        {
            _userRepository = GetService<UserRepository>();
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

            // Fetch accounts
            var accountMap = (await _userRepository.GetWowAccountsByUserId(userId))
                .ToDictionary(k => k.Id);

            // TODO don't hardcode region
            var newAccounts = new List<WowAccount>();
            foreach (var region in EnumUtilities.GetValues<ApiRegion>())
            {
                var uri = GenerateUri(region, ApiNamespace.Profile, path);
                _logger.Debug("uri={0}", uri.ToString());

                try
                {
                    var profile = await GetJson<ApiAccountProfile>(uri, false);
                    if (profile?.Accounts != null)
                    {
                        foreach (var account in profile.Accounts.Where(a => !accountMap.ContainsKey(a.Id)))
                        {
                            newAccounts.Add(new WowAccount
                            {
                                Id = account.Id,
                                UserId = userId,
                                Region = region,
                            });
                            _logger.Debug("{0} new account {1}", region, account.Id);
                        }
                    }
                }
                catch (HttpRequestException e)
                {
                    if (e.Message != "404")
                    {
                        throw e;
                    }
                }

                //_logger.Debug("UserCharactersJob: {@profile}", profile);
            }

            if (newAccounts.Count > 0)
            {
                await _userRepository.AddWowAccounts(newAccounts);
            }
        }
    }
}
