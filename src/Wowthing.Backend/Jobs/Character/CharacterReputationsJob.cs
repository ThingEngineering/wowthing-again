using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.User
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
                _logger.Information("304 Not Modified");
                return;
            }

            // Fetch character
            var character = await _context.PlayerCharacter.FindAsync(query.CharacterId);

            character.ReputationIds = result.Data.Reputations.Select(r => r.Faction.Id).ToList();
            character.ReputationValues = result.Data.Reputations.Select(r => r.Standing.Raw).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
