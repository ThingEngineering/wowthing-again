using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterReputationsJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/reputations";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterReputations>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var reputations = await _context.PlayerCharacterReputations.FindAsync(query.CharacterId);
            if (reputations == null)
            {
                reputations = new PlayerCharacterReputations
                {
                    CharacterId = query.CharacterId,
                };
                _context.PlayerCharacterReputations.Add(reputations);
            }

            reputations.ReputationIds = result.Data.Reputations.Select(r => r.Faction.Id).ToList();
            reputations.ReputationValues = result.Data.Reputations.Select(r => r.Standing.Raw).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
