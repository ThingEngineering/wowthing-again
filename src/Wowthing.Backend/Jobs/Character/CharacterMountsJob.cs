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
    public class CharacterMountsJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/collections/mounts";

        public override async Task Run(params string[] data)
        {
            var result = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            _logger.Debug("sigh {@d}", result);

            var path = string.Format(API_PATH, result.RealmSlug, result.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(result.Region, ApiNamespace.Profile, path);
            var apiMounts = await GetJson<ApiCharacterMounts>(uri);

            var db = _redis.GetDatabase();
            var key = string.Format(RedisKeys.UserMounts, result.UserId);
            var values = apiMounts.Mounts.Select(m => new RedisValue(m.Mount.Id.ToString())).ToArray();
            await db.SetAddAsync(key, values);
        }
    }
}
