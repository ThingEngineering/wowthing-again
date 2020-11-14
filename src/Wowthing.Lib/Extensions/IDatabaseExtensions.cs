using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Wowthing.Lib.Extensions
{
    public static class IDatabaseExtensions
    {
        public static async Task<T> GetJson<T>(this IDatabase db, string key)
            where T : class
        {
            string value = await db.StringGetAsync(key);
            return value == null ? null : JsonSerializer.Deserialize<T>(value);
        }
    }
}
