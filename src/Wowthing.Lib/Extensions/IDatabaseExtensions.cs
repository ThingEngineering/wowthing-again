using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Wowthing.Lib.Extensions
{
    public static class IDatabaseExtensions
    {
        public static async Task<T> JsonGetAsync<T>(this IDatabase db, string key)
            where T : class
        {
            string value = await db.StringGetAsync(key);
            return value == null ? null : JsonConvert.DeserializeObject<T>(value);
        }

        public static async Task<bool> JsonSetAsync<T>(this IDatabase db, string key, T obj)
        {
            return await db.StringSetAsync(key, JsonConvert.SerializeObject(obj));
        }
    }
}
