using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMountsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/mounts";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterMounts resultData;
        var uri = GenerateUri(_query, ApiPath);
        try {
            var result = await GetUriAsJsonAsync<ApiCharacterMounts>(uri, useLastModified: false);
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
        var pcMounts = await Context.PlayerCharacterMounts.FindAsync(_query.CharacterId);
        if (pcMounts == null)
        {
            pcMounts = new PlayerCharacterMounts
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterMounts.Add(pcMounts);
        }

        var mounts = resultData.Mounts
            .Select(mount => mount.Mount.Id)
            .OrderBy(mountId => mountId)
            .ToList();

        if (pcMounts.Mounts == null || !mounts.SequenceEqual(pcMounts.Mounts))
        {
            pcMounts.Mounts = mounts;
        }

        await Context.SaveChangesAsync(CancellationToken);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
