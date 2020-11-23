using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.User
{
    public class UserMountsJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/collections/mounts";

        public override async Task Run(params string[] data)
        {
            var result = JsonConvert.DeserializeObject<CharacterQuery>(data[0]);
            _logger.Debug("sigh {@d}", result);

            var path = string.Format(API_PATH, result.RealmSlug, result.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(result.Region, ApiNamespace.Profile, path);
            var apiMounts = await GetJson<ApiCharacterMounts>(uri);

            var collections = await _context.PlayerCollections
                .Where(pc => pc.UserId == result.UserId)
                .FirstOrDefaultAsync();
            if (collections == null)
            {
                collections = new PlayerCollections
                {
                    UserId = result.UserId,
                };
                _context.PlayerCollections.Add(collections);
            }

            collections.Mounts = apiMounts.Mounts.Select(m => m.Mount.Id).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
