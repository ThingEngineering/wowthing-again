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

        private readonly CharacterRepository _characterRepository;
        private readonly UserRepository _userRepository;

        public UserCharactersJob(HttpClient http, ILogger logger, IServiceScope serviceScope) : base(http, logger, serviceScope)
        {
            _characterRepository = GetService<CharacterRepository>();
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

            // Fetch existing data
            var accountMap = (await _userRepository.GetAccountsByUserId(userId))
                .ToDictionary(k => k.Id);
            var characterMap = (await _characterRepository.GetCharactersByUserId(userId))
                .ToDictionary(k => k.Id);

            var newAccounts = new List<WowAccount>();
            var newCharacters = new List<WowCharacter>();
            var seenCharacters = new HashSet<long>();

            foreach (var region in EnumUtilities.GetValues<ApiRegion>())
            {
                var uri = GenerateUri(region, ApiNamespace.Profile, path);
                try
                {
                    var profile = await GetJson<ApiAccountProfile>(uri, false);
                    if (profile?.Accounts == null)
                    {
                        continue;
                    }

                    foreach (ApiAccountProfileAccount account in profile.Accounts)
                    {
                        if (!accountMap.ContainsKey(account.Id))
                        {
                            newAccounts.Add(new WowAccount
                            {
                                Id = account.Id,
                                UserId = userId,
                                Region = region,
                            });
                            _logger.Debug("{0} new account {1}", region, account.Id);
                        }

                        foreach (ApiAccountProfileCharacter character in account.Characters)
                        {
                            seenCharacters.Add(character.Id);
                            if (characterMap.ContainsKey(character.Id))
                            {
                                continue;
                            }

                            newCharacters.Add(new WowCharacter
                            {
                                Id = character.Id,
                                AccountId = account.Id,
                                GuildId = 0,
                                ClassId = character.Class.Id,
                                Level = character.Level,
                                RaceId = character.Race.Id,
                                RealmId = character.Realm.Id,
                                Faction = character.Faction.EnumParse<WowFaction>(),
                                Gender = character.Gender.EnumParse<WowGender>(),
                                Name = character.Name,
                                LastModified = DateTime.MinValue,
                            });
                            _logger.Debug("{0} new character {1}", region, character.Id);
                        }
                    }
                }
                catch (HttpRequestException e)
                {
                    _logger.Debug("exception: {e}", e.Message);
                    if (e.Message != "404")
                    {
                        throw e;
                    }
                }
            }

            await _userRepository.AddAccounts(newAccounts);
            await _characterRepository.AddCharacters(newCharacters);

            // delete characters not seen?
        }
    }
}
