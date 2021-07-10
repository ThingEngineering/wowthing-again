using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.NonBlizzard
{
    public class CharacterRaiderIoJob : JobBase
    {
        private const string ApiUrl = "https://raider.io/api/v1/characters/profile?region={0}&realm={1}&name={2}&fields=mythic_plus_scores_by_season%3A{3}";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch seasons
            var seasonIds = JsonConvert.DeserializeObject<int[]>(data[1]);
            
            var seasons = await Context.WowMythicPlusSeason
                .Where(s => s.Region == query.Region && seasonIds.Contains(s.Id))
                .Select(s => s.Id)
                .OrderByDescending(s => s)
                .ToArrayAsync();

            var oof = string.Join(":",
                seasons.Select(s => ApiCharacterRaiderIoSeason.SeasonMap.First(kvp => kvp.Value == s).Key));

            // Fetch API data
            var uri = new Uri(string.Format(ApiUrl, query.Region.ToString().ToLowerInvariant(), query.RealmSlug, query.CharacterName.ToLowerInvariant(), oof));

            var result = await GetJson<ApiCharacterRaiderIo>(uri, useAuthorization: false, useLastModified: false);
            /*if (result.NotModified)
            {
                LogNotModified();
                return;
            }*/

            // Fetch character data
            var raiderIo = await Context.PlayerCharacterRaiderIo.FindAsync(query.CharacterId);
            if (raiderIo == null)
            {
                raiderIo = new PlayerCharacterRaiderIo
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterRaiderIo.Add(raiderIo);
            }

            raiderIo.Seasons ??= new();

            foreach (var season in result.Data.ScoresBySeason.EmptyIfNull())
            {
                raiderIo.Seasons[season.SeasonId] = new PlayerCharacterRaiderIoSeasonScores
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

            await Context.SaveChangesAsync();
        }
    }
}
