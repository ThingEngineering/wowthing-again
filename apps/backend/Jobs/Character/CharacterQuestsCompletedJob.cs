using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterQuestsCompletedJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/quests/completed";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        // Fetch API data
        ApiCharacterQuestsCompleted resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterQuestsCompleted>(uri, useLastModified: false);
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
        var pcQuests = await Context.PlayerCharacterQuests.FindAsync(query.CharacterId);
        if (pcQuests == null)
        {
            pcQuests = new PlayerCharacterQuests
            {
                CharacterId = query.CharacterId,
            };
            Context.PlayerCharacterQuests.Add(pcQuests);
        }

        var completedIds = resultData.Quests
            .EmptyIfNull()
            .Select(quest => quest.Id)
            .OrderBy(id => id)
            .ToList();

        if (pcQuests.CompletedIds == null || !completedIds.SequenceEqual(pcQuests.CompletedIds))
        {
            pcQuests.CompletedIds = completedIds;
        }

        int updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheQuests, query.UserId.ToString());
        }
    }
}
