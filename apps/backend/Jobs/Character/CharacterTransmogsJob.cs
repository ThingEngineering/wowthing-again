using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

// Don't use this for now, the character endpoint straight up lies about what appearances you have
public class CharacterTransmogsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/transmogs";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterTransmogs resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterTransmogs>(uri, useLastModified: false);
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
        var pcTransmog = await Context.PlayerCharacterTransmog.FindAsync(_query.CharacterId);
        if (pcTransmog == null)
        {
            pcTransmog = new PlayerCharacterTransmog(_query.CharacterId);
            Context.PlayerCharacterTransmog.Add(pcTransmog);
        }

        // ItemAppearance, NOT ItemModifiedAppearance :(
        var appearanceIds = resultData.Slots
            .SelectMany(slot => slot.Appearances.Select(app => app.Id))
            .Order()
            .Distinct()
            .ToList();

        if (pcTransmog.TransmogIds == null || !appearanceIds.SequenceEqual(pcTransmog.TransmogIds))
        {
            pcTransmog.TransmogIds = appearanceIds;

            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheTransmog, _query.UserId.ToString());
            Logger.Debug("Regenerating transmog cache");
        }

        await Context.SaveChangesAsync(CancellationToken);
    }
}
