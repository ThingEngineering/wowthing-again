using System;
using System.Collections.Generic;
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
    }
}
