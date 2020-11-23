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

        public static async Task<string[]> SaneGetValuesAsync(this IDatabase db, string[] keys)
        {
            var ret = new string[keys.Length];
            /*await using var pipeline = db.CreatePipeline();
            for (int i = 0; i < keys.Length; i++)
            {
                // capture index
                int index = i;
                pipeline.QueueCommand(r => r.GetValueAsync(keys[i]), s => ret[index] = s);
            }
            await pipeline.FlushAsync();*/
            await Task.Delay(1);
            return ret;
        }

        public static async Task SaneSetValuesAsync(this IDatabase db, IEnumerable<string> keys, string value, TimeSpan expiry)
        {
            /*await using var pipeline = db.CreatePipeline();
            foreach (string key in keys)
            {
                pipeline.QueueCommand(r => r.SetValueAsync(key, value, expiry));
            }
            await pipeline.FlushAsync();*/
            await Task.Delay(1);
        }
    }
}
