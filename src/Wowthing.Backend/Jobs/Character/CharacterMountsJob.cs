using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterMountsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/collections/mounts";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterMounts>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            var db = Redis.GetDatabase();
            var key = string.Format(RedisKeys.USER_MOUNTS, query.UserId);
            var values = result.Data.Mounts.Select(m => new RedisValue(m.Mount.Id.ToString())).ToArray();
            await db.SetAddAsync(key, values);
        }
    }
}
