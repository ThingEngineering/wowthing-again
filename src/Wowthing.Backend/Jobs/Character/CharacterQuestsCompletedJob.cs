using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.User
{
    public class CharacterQuestsCompletedJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/quests/completed";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterQuestsCompleted>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var quests = await _context.PlayerCharacterQuests.FindAsync(query.CharacterId);
            if (quests == null)
            {
                quests = new PlayerCharacterQuests
                {
                    CharacterId = query.CharacterId,
                };
                _context.PlayerCharacterQuests.Add(quests);
            }

            quests.CompletedIds = result.Data.Quests.Select(q => q.Id).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
