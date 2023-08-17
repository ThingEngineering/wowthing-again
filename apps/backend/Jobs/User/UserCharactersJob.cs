using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Profile;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User;

public class UserCharactersJob : JobBase
{
    private const string ApiPath = "profile/user/wow?access_token={0}";

    public override async Task Run(params string[] data)
    {
        using var shrug = UserLog(data[0]);
        var timer = new JankTimer();

        var userId = long.Parse(data[0]);

        // Get user access token
        var accessToken = await Context.UserTokens.FirstOrDefaultAsync(t =>
            t.UserId == userId && t.LoginProvider == "BattleNet" && t.Name == "access_token");
        if (accessToken == null)
        {
            Logger.Error("No access_token for user {0}", userId);
            return;
        }

        var path = string.Format(ApiPath, accessToken.Value);

        timer.AddPoint("Token");

        // Fetch existing accounts
        var accountMap = new Dictionary<(WowRegion, long), PlayerAccount>();

        // Add any new accounts
        var apiAccounts = new List<(WowRegion, ApiAccountProfileAccount)>();
        foreach (var region in EnumUtilities.GetValues<WowRegion>())
        {
            // FIXME remove this if Blizzard ever fixes their broken APIs
            if (region == WowRegion.KR || region == WowRegion.TW)
            {
                continue;
            }

            var uri = GenerateUri(region, ApiNamespace.Profile, path);
            try
            {
                var result = await GetJson<ApiAccountProfile>(uri, useAuthorization: false, useLastModified: false);
                var profile = result.Data;
                if (profile?.Accounts == null)
                {
                    continue;
                }

                var accountIds = profile.Accounts
                    .Select(apiAccount => apiAccount.Id)
                    .ToArray();
                var accounts = await Context.PlayerAccount
                    .Where(pa => pa.Region == region && accountIds.Contains(pa.AccountId))
                    .ToArrayAsync();

                foreach (var account in accounts)
                {
                    Logger.Information("Found existing account {0}/{1}", region, account.AccountId);
                    accountMap[(region, account.AccountId)] = account;
                }

                foreach (var apiAccount in profile.Accounts)
                {
                    apiAccounts.Add((region, apiAccount));

                    if (!accountMap.TryGetValue((region, apiAccount.Id), out var playerAccount))
                    {
                        playerAccount = accountMap[(region, apiAccount.Id)] = new PlayerAccount
                        {
                            AccountId = apiAccount.Id,
                            Region = region,
                        };
                        Context.PlayerAccount.Add(playerAccount);
                        Logger.Information("Added new account {0}/{1}", region, apiAccount.Id);
                    }
                    else if (playerAccount.UserId != userId)
                    {
                        Logger.Warning("Changed owner of account {region} {id} from {user1} to {user2}",
                            region, playerAccount.AccountId, playerAccount.UserId, userId);
                        playerAccount.Enabled = true;
                    }

                    playerAccount.UserId = userId;
                }
            }
            catch (HttpRequestException e)
            {
                if (e.Message != "404")
                {
                    Logger.Error("HTTP request failed: {region} {e} {sigh}", region, e.Message, e.StatusCode);
                }
            }
            catch (Exception ex) when (ex is TimeoutException or TaskCanceledException)
            {
                Logger.Error("HTTP request timed out: {region} {msg}", region, ex.Message);
            }
        }

        await Context.SaveChangesAsync();

        timer.AddPoint("API");

        // Fetch existing characters
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
            int accountId = accountMap[(region, apiAccount.Id)].Id;
            int added = 0;

            foreach (ApiAccountProfileCharacter apiCharacter in apiAccount.Characters)
            {
                try
                {
                    var key = (apiCharacter.Realm.Id, apiCharacter.Name);

                    if (!characterMap.TryGetValue(key, out PlayerCharacter character))
                    {
                        character = characterMap[key] = new PlayerCharacter
                        {
                            CharacterId = apiCharacter.Id,
                            LastApiCheck = MiscConstants.DefaultDateTime,
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
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Error in region {Region}", region.ToString());
                    Logger.Warning("Character: {json}", JsonConvert.SerializeObject(apiCharacter));
                }
            }

            if (added > 0)
            {
                Logger.Information("Added {Added} character(s) to account {Region}/{AccountId}", added, region,
                    apiAccount.Id);
            }
        }

        timer.AddPoint("Characters");

        int written = await Context.SaveChangesAsync();
        if (written > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, userId);
        }

        timer.AddPoint("Save");

        // Unlink any characters that weren't in the API response
        var seenAccountIds = new List<int>();
        foreach (var (region, apiAccount) in apiAccounts)
        {
            int accountId = accountMap[(region, apiAccount.Id)].Id;
            seenAccountIds.Add(accountId);

            var characterIds = new List<int>();
            foreach (var apiCharacter in apiAccount.Characters)
            {
                if (characterMap.TryGetValue((apiCharacter.Realm?.Id ?? 0, apiCharacter.Name), out var character))
                {
                    characterIds.Add(character.Id);
                }
                else
                {
                    Logger.Warning("Invalid character??");
                }
            }

            int unlinkedCharacters = await Context.PlayerCharacter
                .Where(pc => pc.AccountId == accountId && !characterIds.Contains(pc.Id))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(pc => pc.AccountId, pc => null)
                );

            if (unlinkedCharacters > 0)
            {
                Logger.Information("Unlinked {0} character(s) from account {1}/{2}",
                    unlinkedCharacters, region, accountId);
            }
        }

        // Unlink accounts that weren't in the response
        var otherAccounts = await Context.PlayerAccount
            .Where(pa => pa.UserId == userId && !seenAccountIds.Contains(pa.Id))
            .ToArrayAsync();
        if (otherAccounts.Length > 0)
        {
            foreach (var otherAccount in otherAccounts)
            {
                otherAccount.UserId = null;
                Logger.Information("Unlinked account {0}/{1}", otherAccount.Region, otherAccount.Id);
            }

            await Context.SaveChangesAsync();
        }

        timer.AddPoint("Unlink", true);

        Logger.Information("{timer}", timer.ToString());
    }
}
