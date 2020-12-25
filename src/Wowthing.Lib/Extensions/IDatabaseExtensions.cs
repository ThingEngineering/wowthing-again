using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Wowthing.Lib.Extensions
{
    public static class IDatabaseExtensions
    {
        public static async Task<string[]> GetSetMembersAsync(this IDatabase db, string key)
        {
            var members = await db.SetMembersAsync(key);
            return members?.Select(r => (string)r)?.ToArray() ?? Array.Empty<string>();
        }

        public static async Task<T> JsonGetAsync<T>(this IDatabase db, string key)
            where T : class
        {
            string value = await db.StringGetAsync(key);
            return value == null ? null : JsonConvert.DeserializeObject<T>(value);
        }

        public static async Task<bool> JsonSetAsync<T>(this IDatabase db, string key, T obj, TimeSpan? expiry = null)
        {
            return await db.StringSetAsync(key, JsonConvert.SerializeObject(obj), expiry);
        }

        public static async Task<string[]> StringMultiGetAsync(this IDatabase db, IEnumerable<string> keys)
        {
            var tasks = keys.Select(k => db.StringGetAsync(k));
            await Task.WhenAll(tasks);
            return tasks.Select(t => t.Result.ToString()).ToArray();
        }

        public static async Task StringMultiSetAsync(this IDatabase db, IEnumerable<string> keys, string value, TimeSpan? expiry = null)
        {
            var tasks = keys.Select(k => db.StringSetAsync(k, value, expiry));
            await Task.WhenAll(tasks);
        }
    }
}
