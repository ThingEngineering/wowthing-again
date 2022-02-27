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
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterReputations>(uri);
            if (result.NotModified)
            {
                LogNotModified();
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

            reputations.ReputationIds = result.Data.Reputations.Select(r => r.Faction.Id).ToList();
            reputations.ReputationValues = result.Data.Reputations.Select(r => r.Standing.Raw).ToList();

            await Context.SaveChangesAsync();
        }
    }
}
