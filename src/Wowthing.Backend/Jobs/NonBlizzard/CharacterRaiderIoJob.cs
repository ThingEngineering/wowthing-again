using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
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

            raiderIo.Seasons = result.Data.ScoresBySeason
                .ToDictionary(
                    k => k.SeasonId,
                    v => new PlayerCharacterRaiderIoSeasonScores
                    {
                        All = v.ScoreAll,
                        Dps = v.ScoreDps,
                        Healer = v.ScoreHealer,
                        Tank = v.ScoreTank,
                        Spec1 = v.ScoreSpec1,
                        Spec2 = v.ScoreSpec2,
                        Spec3 = v.ScoreSpec3,
                        Spec4 = v.ScoreSpec4,
                    }
                );

            await Context.SaveChangesAsync();
        }
    }
}
