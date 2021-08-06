using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterQuestsCompletedJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/quests/completed";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(ApiPath, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterQuestsCompleted>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var quests = await Context.PlayerCharacterQuests.FindAsync(query.CharacterId);
            if (quests == null)
            {
                quests = new PlayerCharacterQuests
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterQuests.Add(quests);
            }

            quests.CompletedIds = result.Data.Quests
                .EmptyIfNull()
                .Select(q => q.Id)
                .ToList();

            await Context.SaveChangesAsync();
        }
    }
}
