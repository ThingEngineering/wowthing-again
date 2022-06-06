using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterReputationsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/reputations";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]) ??
                        throw new InvalidJsonException(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            ApiCharacterReputations resultData;
            var uri = GenerateUri(query, ApiPath);
            try
            {
                var result = await GetJson<ApiCharacterReputations>(uri);
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
            var reputations = await Context.PlayerCharacterReputations.FindAsync(query.CharacterId);
            if (reputations == null)
            {
                reputations = new PlayerCharacterReputations
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterReputations.Add(reputations);
            }

            reputations.ReputationIds = resultData.Reputations.Select(r => r.Faction.Id).ToList();
            reputations.ReputationValues = resultData.Reputations.Select(r => r.Standing.Raw).ToList();

            await Context.SaveChangesAsync();
        }
    }
}
