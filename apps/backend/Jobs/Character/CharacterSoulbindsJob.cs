using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterSoulbindsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/soulbinds";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterSoulbinds resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterSoulbinds>(uri, useLastModified: false);
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
        var shadowlands = await Context.PlayerCharacterShadowlands.FindAsync(_query.CharacterId);
        if (shadowlands == null)
        {
            shadowlands = new PlayerCharacterShadowlands
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterShadowlands.Add(shadowlands);
        }

        shadowlands.CovenantId = resultData.ChosenCovenant?.Id ?? 0;
        shadowlands.RenownLevel = resultData.RenownLevel;

        var soulbind = resultData.Soulbinds?.FirstOrDefault(s => s.IsActive);
        if (soulbind != null)
        {
            shadowlands.SoulbindId = soulbind.Soulbind.Id;

            var conduits = soulbind.Traits
                .EmptyIfNull()
                .Where(t => t.Conduit?.Socket != null)
                .OrderBy(t => t.Tier)
                .ToArray();

            shadowlands.ConduitIds = conduits
                .EmptyIfNull()
                .Select(c => c.Conduit.Socket.Conduit.Id)
                .ToList();

            shadowlands.ConduitRanks = conduits
                .EmptyIfNull()
                .Select(c => c.Conduit.Socket.Rank)
                .ToList();
        }
        else
        {
            shadowlands.SoulbindId = 0;
            shadowlands.ConduitIds = new List<int>();
            shadowlands.ConduitRanks = new List<int>();
        }

        await Context.SaveChangesAsync();
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
