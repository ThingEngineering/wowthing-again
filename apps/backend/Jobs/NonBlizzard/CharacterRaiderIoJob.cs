using System.Net.Http;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.NonBlizzard;

public class CharacterRaiderIoJob : JobBase
{
    private const string ApiUrl = "https://raider.io/api/v1/characters/profile?region={0}&realm={1}&name={2}&fields=mythic_plus_scores_by_season:{3}";
    private int _characterId;
    private long _userId;

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch seasons
        var seasonIds = JsonSerializer
            .Deserialize<int[]>(data[1])
            .EmptyIfNull();

        var oofParts = new List<string>();
        foreach (var seasonId in seasonIds)
        {
            var rioSeasons = ApiCharacterRaiderIoSeason.SeasonMap
                .Where(kvp => kvp.Value == seasonId)
                .ToArray();
            if (rioSeasons.Length > 0)
            {
                oofParts.Add(rioSeasons[0].Key);
            }
        }

        if (oofParts.Count == 0)
        {
            Logger.Information("No matching seasons found: {Seasons}", string.Join(",", seasonIds.Select(id => id.ToString())));
            return;
        }

        var oof = string.Join(":", oofParts);

        // Fetch API data
        var uri = new Uri(string.Format(ApiUrl, _query.Region.ToString().ToLowerInvariant(), _query.RealmSlug, _query.CharacterName, oof));

        ApiCharacterRaiderIo resultData;
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterRaiderIo>(uri, useAuthorization: false, useLastModified: false);
            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var raiderIo = await Context.PlayerCharacterRaiderIo.FindAsync(_query.CharacterId);
        if (raiderIo == null)
        {
            raiderIo = new PlayerCharacterRaiderIo
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterRaiderIo.Add(raiderIo);
        }

        var seasons = new Dictionary<int, PlayerCharacterRaiderIoSeasonScores>(raiderIo.Seasons.EmptyIfNull());
        foreach (var season in resultData.ScoresBySeason.EmptyIfNull())
        {
            seasons[season.SeasonId] = new PlayerCharacterRaiderIoSeasonScores
            {
                All = season.ScoreAll,
                Dps = season.ScoreDps,
                Healer = season.ScoreHealer,
                Tank = season.ScoreTank,
                Spec1 = season.ScoreSpec1,
                Spec2 = season.ScoreSpec2,
                Spec3 = season.ScoreSpec3,
                Spec4 = season.ScoreSpec4,
            };
        }

        raiderIo.Seasons = seasons;

        await Context.SaveChangesAsync(CancellationToken);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
