using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

// Don't use this for now, the character endpoint straight up lies about what appearances you have
public class CharacterTransmogsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/transmogs";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        // Fetch API data
        ApiCharacterTransmogs resultData;
        var uri = GenerateUri(query, ApiPath);
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
        var pcTransmog = await Context.PlayerCharacterTransmog.FindAsync(query.CharacterId);
        if (pcTransmog == null)
        {
            pcTransmog = new PlayerCharacterTransmog
            {
                CharacterId = query.CharacterId,
            };
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

            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheTransmog, query.UserId.ToString());
            Logger.Debug("Regenerating transmog cache");
        }

        await Context.SaveChangesAsync();
    }
}
