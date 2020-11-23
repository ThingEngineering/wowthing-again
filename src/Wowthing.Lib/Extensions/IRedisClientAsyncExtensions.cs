using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ServiceStack.Redis;

namespace Wowthing.Lib.Extensions
{
    public static class IRedisClientAsyncExtensions
    {
        public static async Task<T> JsonGetAsync<T>(this IRedisClientAsync db, string key)
            where T : class
        {
            string value = await db.GetValueAsync(key);
            return value == null ? null : JsonConvert.DeserializeObject<T>(value);
        }

        public static async Task JsonSetAsync<T>(this IRedisClientAsync db, string key, T obj)
        {
            await db.SetValueAsync(key, JsonConvert.SerializeObject(obj));
        }

        public static async Task<string[]> SaneGetValuesAsync(this IRedisClientAsync db, string[] keys)
        {
            var ret = new string[keys.Length];
            await using var pipeline = db.CreatePipeline();
            for (int i = 0; i < keys.Length; i++)
            {
                // capture index
                int index = i;
                pipeline.QueueCommand(r => r.GetValueAsync(keys[i]), s => ret[index] = s); 
            }
            await pipeline.FlushAsync();
            return ret;
        }

        public static async Task SaneSetValuesAsync(this IRedisClientAsync db, IEnumerable<string> keys, string value, TimeSpan expiry)
        {
            await using var pipeline = db.CreatePipeline();
            foreach (string key in keys)
            {
                pipeline.QueueCommand(r => r.SetValueAsync(key, value, expiry));
            }
            await pipeline.FlushAsync();
        }
    }
}
