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
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.User
{
    public class CharacterSoulbindsJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/soulbinds";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterSoulbinds>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var shadowlands = await _context.PlayerCharacterShadowlands.FindAsync(query.CharacterId);
            if (shadowlands == null)
            {
                shadowlands = new PlayerCharacterShadowlands
                {
                    CharacterId = query.CharacterId,
                };
                _context.PlayerCharacterShadowlands.Add(shadowlands);
            }

            shadowlands.CovenantId = result.Data.ChosenCovenant?.Id ?? 0;
            shadowlands.RenownLevel = result.Data.RenownLevel;

            var soulbind = result.Data.Soulbinds?.FirstOrDefault(s => s.IsActive);
            if (soulbind != null)
            {
                shadowlands.SoulbindId = soulbind.Soulbind.Id;

                var conduits = soulbind.Traits.Where(t => t.Conduit?.Socket != null).OrderBy(t => t.Tier);
                shadowlands.ConduitIds = conduits.Select(c => c.Conduit.Socket.Conduit.Id).ToList();
                shadowlands.ConduitRanks = conduits.Select(c => c.Conduit.Socket.Rank).ToList();
            }
            else
            {
                shadowlands.SoulbindId = 0;
                shadowlands.ConduitIds = new List<int>();
                shadowlands.ConduitRanks = new List<int>();
            }

            await _context.SaveChangesAsync();
        }
    }
}
