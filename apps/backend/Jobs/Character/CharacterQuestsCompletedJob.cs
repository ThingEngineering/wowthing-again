using System.Net.Http;
using Equativ.RoaringBitmaps;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterQuestsCompletedJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/quests/completed";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        JobHttpResult<ApiCharacterQuestsCompleted> result;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            result = await GetUriAsJsonAsync<ApiCharacterQuestsCompleted>(uri, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var pcQuests = await Context.PlayerCharacterQuests.FindAsync(_query.CharacterId);
        if (pcQuests == null)
        {
            pcQuests = new PlayerCharacterQuests
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterQuests.Add(pcQuests);
        }

        pcQuests.ScannedAt = result.LastModified;

        var completedIds = result.Data.Quests
            .EmptyIfNull()
            .Select(quest => quest.Id)
            .Order()
            .ToList();

        byte[] compressedCompletedIds = SerializationUtilities.SerializeToBitmap(completedIds);

        if (pcQuests.CompressedCompletedIds == null || !compressedCompletedIds.SequenceEqual(pcQuests.CompressedCompletedIds))
        {
            pcQuests.CompletedIds = null;
            pcQuests.CompressedCompletedIds = compressedCompletedIds;
        }

        int updated = await Context.SaveChangesAsync(CancellationToken);
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedQuests, _query.UserId);
        }
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
