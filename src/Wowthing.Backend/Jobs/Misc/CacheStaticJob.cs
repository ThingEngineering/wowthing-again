using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CacheStaticJob : JobBase, IScheduledJob
    {
        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.CacheStatic,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
        };

        public override async Task Run(params string[] data)
        {
            var db = _redis.GetDatabase();

            var cacheData = new RedisStaticCache
            {
                Class = await _context.WowClass.ToDictionaryAsync(c => c.Id.ToString()),
                Race = await _context.WowRace.ToDictionaryAsync(c => c.Id.ToString()),
                Realm = await _context.WowRealm.ToDictionaryAsync(c => c.Id.ToString()),
            };
            
            var cacheJson = JsonSerializer.Serialize(cacheData);
            var cacheHash = cacheJson.Md5();

            db.WaitAll(
                db.StringSetAsync("cached_static:data", cacheJson),
                db.StringSetAsync("cached_static:hash", cacheHash)
            );
        }
    }
}
