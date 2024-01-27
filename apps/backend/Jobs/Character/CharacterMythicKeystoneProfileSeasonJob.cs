using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMythicKeystoneProfileSeasonJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/mythic-keystone-profile/season/{2}";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        var seasonId = int.Parse(data[1]);
        using var shrug = CharacterLog(query);

        // Fetch API data
        ApiCharacterMythicKeystoneProfileSeason resultData;
        var uri = GenerateUri(query, ApiPath, data[1]);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterMythicKeystoneProfileSeason>(uri, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var seasonMap = await Context.PlayerCharacterMythicPlusSeason
            .Where(mps => mps.CharacterId == query.CharacterId)
            .ToDictionaryAsync(k => k.Season);

        if (resultData.BestRuns != null)
        {
            if (!seasonMap.TryGetValue(seasonId, out PlayerCharacterMythicPlusSeason season))
            {
                season = new PlayerCharacterMythicPlusSeason
                {
                    CharacterId = query.CharacterId,
                    Season = seasonId,
                };
                Context.PlayerCharacterMythicPlusSeason.Add(season);
            }

            season.Runs = resultData.BestRuns
                .EmptyIfNull()
                .Select(run => new PlayerCharacterMythicPlusRun()
                {
                    Affixes = run.Affixes.EmptyIfNull().Select(a => a.Id).ToList(),
                    Completed = run.CompletedTimestamp.AsUtcTimestamp(),
                    DungeonId = run.Dungeon.Id,
                    Duration = run.Duration,
                    KeystoneLevel = run.KeystoneLevel,
                    Members = run.Members.EmptyIfNull().Select(member => new PlayerCharacterMythicPlusRunMember
                    {
                        ItemLevel = member.ItemLevel,
                        Name = member.Character.Name,
                        RealmId = member.Character.Realm.Id,
                        SpecializationId = member.Specialization.Id,
                    }).ToList(),
                    Timed = run.Timed,
                })
                .ToList();
        }

        int updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
        }
    }
}
