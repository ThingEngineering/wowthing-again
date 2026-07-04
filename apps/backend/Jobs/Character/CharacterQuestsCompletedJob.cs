using System.Net.Http;
using Equativ.RoaringBitmaps;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

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
        ApiCharacterQuestsCompleted resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterQuestsCompleted>(uri, useLastModified: false);
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
        var pcQuests = await Context.PlayerCharacterQuests.FindAsync(_query.CharacterId);
        if (pcQuests == null)
        {
            pcQuests = new PlayerCharacterQuests
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterQuests.Add(pcQuests);
        }

        var completedIds = resultData.Quests
            .EmptyIfNull()
            .Select(quest => quest.Id)
            .Order()
            .ToList();

        bool questIdsChanged = pcQuests.CompletedIds == null || !completedIds.SequenceEqual(pcQuests.CompletedIds);
        if (questIdsChanged)
        {
            pcQuests.CompletedIds = completedIds;
        }

        if (pcQuests.CompressedCompletedIds == null || questIdsChanged)
        {
            var bitmap = RoaringBitmap.Create(completedIds);

            using var stream = new MemoryStream();
            RoaringBitmap.Serialize(bitmap, stream);
            pcQuests.CompressedCompletedIds = stream.ToArray();
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
