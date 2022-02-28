using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Profile;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User
{
    public class UserCharactersJob : JobBase
    {
        private const string ApiPath = "profile/user/wow?access_token={0}";

        public override async Task Run(params string[] data)
        {
            using var shrug = UserLog(data[0]);

            var userId = long.Parse(data[0]);

            var accessToken = await Context.UserTokens.FirstOrDefaultAsync(t =>
                t.UserId == userId && t.LoginProvider == "BattleNet" && t.Name == "access_token");
            if (accessToken == null)
            {
                Logger.Error("No access_token for user {0}", userId);
                return;
            }

            var path = string.Format(ApiPath, accessToken.Value);

            // Fetch existing accounts
            var accountMap = await Context.PlayerAccount.Where(a => a.UserId == userId)
                .ToDictionaryAsync(k => (k.Region, k.AccountId));

            // Add any new accounts
            var apiAccounts = new List<(WowRegion, ApiAccountProfileAccount)>();
            foreach (var region in EnumUtilities.GetValues<WowRegion>())
            {
                var uri = GenerateUri(region, ApiNamespace.Profile, path);
                try
                {
                    var result = await GetJson<ApiAccountProfile>(uri, useAuthorization: false, useLastModified: false);
                    var profile = result.Data;
                    if (profile?.Accounts == null)
                    {
                        continue;
                    }

                    foreach (ApiAccountProfileAccount account in profile.Accounts)
                    {
                        apiAccounts.Add((region, account));

                        // TODO handle account changing owner? is that even possible?
                        if (!accountMap.ContainsKey((region, account.Id)))
                        {
                            var newAccount = new PlayerAccount
                            {
                                AccountId = account.Id,
                                Region = region,
                                UserId = userId,
                            };
                            Context.PlayerAccount.Add(newAccount);
                            accountMap[(region, account.Id)] = newAccount;
                            Logger.Information("Added new account {0}/{1}", region, account.Id);
                        }
                    }
                }
                catch (HttpRequestException e)
                {
                    Logger.Warning("HTTP request failed: {region} {e}", region, e.Message);
                }
            }

            await Context.SaveChangesAsync();

            // Fetch existing users
            var characterPairs = apiAccounts
                .SelectMany(a => a.Item2.Characters)
                .Select(c => (c.Realm.Id, c.Name))
                .ToArray();

            var orPredicate = PredicateBuilder.False<PlayerCharacter>();
            foreach ((int realmId, string name) in characterPairs)
            {
                orPredicate = orPredicate.Or(c => c.RealmId == realmId && c.Name == name);
            }

            var characterMap = await Context.PlayerCharacter
                .Where(orPredicate)
                .ToDictionaryAsync(k => (k.RealmId, k.Name));

            // Loop over API results
            foreach ((var region, var apiAccount) in apiAccounts)
            {
                int accountId = 0;
                int added = 0;

                try
                {
                    accountId = accountMap[(region, apiAccount.Id)].Id;
                    foreach (ApiAccountProfileCharacter apiCharacter in apiAccount.Characters)
                    {
                        var key = (apiCharacter.Realm.Id, apiCharacter.Name);

                        if (!characterMap.TryGetValue(key, out PlayerCharacter character))
                        {
                            character = characterMap[key] = new PlayerCharacter
                            {
                                CharacterId = apiCharacter.Id,
                            };
                            Context.PlayerCharacter.Add(character);
                            added++;
                        }

                        character.AccountId = accountId;
                        character.ClassId = apiCharacter.Class.Id;
                        character.Level = apiCharacter.Level;
                        character.RaceId = apiCharacter.Race.Id;
                        character.RealmId = apiCharacter.Realm.Id;
                        character.Faction = apiCharacter.Faction.EnumParse<WowFaction>();
                        character.Gender = apiCharacter.Gender.EnumParse<WowGender>();
                        character.Name = apiCharacter.Name;

                        character.LastApiCheck = DateTime.UtcNow - TimeSpan.FromDays(7);
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Error in region {Region}", region.ToString());
                }

                if (added > 0)
                {
                    Logger.Information("Added {Added} character(s) to account {Region}/{AccountId}", added, region, accountId);
                }
            }

            await Context.SaveChangesAsync();

            foreach ((var region, var apiAccount) in apiAccounts)
            {
                var accountId = accountMap[(region, apiAccount.Id)].Id;
                var characterIds = apiAccount.Characters
                    .Select(c => characterMap[(c.Realm.Id, c.Name)].Id)
                    .ToArray();

                int deleted = await Context
                    .DeleteRangeAsync<PlayerCharacter>(c => c.AccountId == accountId && !characterIds.Contains(c.Id));
                if (deleted > 0)
                {
                    Logger.Information("Deleted {0} character(s) from account {1}/{2}", deleted, region, accountId);
                }
            }
        }
    }
}