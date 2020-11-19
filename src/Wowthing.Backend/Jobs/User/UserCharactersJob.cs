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
using Wowthing.Lib.Extensions;
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

        public UserCharactersJob(IServiceScope serviceScope) : base(serviceScope)
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

            // Fetch existing accounts
            var accountMap = await _userRepository.GetAccountsByUserId(userId)
                .ToDictionaryAsync(k => k.Id);

            // Add any new accounts
            var apiAccounts = new List<ApiAccountProfileAccount>();
            var newAccounts = new List<WowAccount>();
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
                        apiAccounts.Add(account);

                        // TODO handle account changing owner? is that even possible?
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

            _userRepository.AddAccounts(newAccounts);
            await _userRepository.SaveChangesAsync();

            // Fetch existing users
            var characterIds = apiAccounts.SelectMany(a => a.Characters).Select(c => c.Id);
            var characterMap = await _characterRepository.GetCharactersByIds(characterIds)
                .ToDictionaryAsync(k => k.Id);

            var newCharacters = new List<WowCharacter>();
            var seenCharacters = new HashSet<long>();
            foreach (ApiAccountProfileAccount apiAccount in apiAccounts)
            {
                foreach (ApiAccountProfileCharacter apiCharacter in apiAccount.Characters)
                {
                    seenCharacters.Add(apiCharacter.Id);

                    if (!characterMap.TryGetValue(apiCharacter.Id, out WowCharacter character))
                    {
                        character = new WowCharacter
                        {
                            Id = character.Id,
                            GuildId = 0,
                            LastModified = DateTime.MinValue,
                        };
                        newCharacters.Add(character);
                    }

                    character.AccountId = apiAccount.Id;
                    character.ClassId = apiCharacter.Class.Id;
                    character.Level = apiCharacter.Level;
                    character.RaceId = apiCharacter.Race.Id;
                    character.RealmId = apiCharacter.Realm.Id;
                    character.Faction = apiCharacter.Faction.EnumParse<WowFaction>();
                    character.Gender = apiCharacter.Gender.EnumParse<WowGender>();
                    character.Name = apiCharacter.Name;
                }
            }

            _characterRepository.AddCharacters(newCharacters);
            await _characterRepository.SaveChangesAsync();

            // Orphan characters not seen
            await _characterRepository.OrphanCharacters(apiAccounts.Select(a => a.Id), seenCharacters);
        }
    }
}
