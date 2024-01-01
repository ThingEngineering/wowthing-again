using System.Text;
using K4os.Compression.LZ4;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Wowthing.Lib.Extensions;

public static class DatabaseExtensions
{
    public static async Task<DateTimeOffset> DateTimeOffsetGetAsync(this IDatabase db, string key)
    {
        string value = await db.StringGetAsync(key);
        return value == null ? DateTimeOffset.MinValue : DateTimeOffset.FromUnixTimeSeconds(int.Parse(value));
    }

    public static async Task<bool> DateTimeOffsetSetAsync(
        this IDatabase db,
        string key,
        DateTimeOffset dateTimeOffset,
        CommandFlags flags = CommandFlags.None
    )
    {
        return await db.StringSetAsync(key, dateTimeOffset.ToUnixTimeSeconds().ToString(), flags: flags);
    }

    public static async Task<string[]> GetSetMembersAsync(this IDatabase db, string key)
    {
        var members = await db.SetMembersAsync(key);
        return members
            .EmptyIfNull()
            .Select(r => (string)r)
            .ToArray();
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
        var tasks = keys.Select(k => db.StringGetAsync(k)).ToArray();
        await Task.WhenAll(tasks);
        return tasks.Select(t => t.Result.ToString()).ToArray();
    }

    public static async Task StringMultiSetAsync(this IDatabase db, IEnumerable<string> keys, string value, TimeSpan? expiry = null)
    {
        var tasks = keys.Select(k => db.StringSetAsync(k, value, expiry));
        await Task.WhenAll(tasks);
    }

    public static async Task SetCacheDataAndHash(this IDatabase db, string key, string data, string hash)
    {
        await db.StringSetAsync($"cache:{key}:data", data);
        await db.StringSetAsync($"cache:{key}:hash", hash);
    }

    public static async Task<string> CompressedStringGetAsync(this IDatabase db, string key, bool delete = false)
    {
        var value = await (delete ? db.StringGetDeleteAsync(key) : db.StringGetAsync(key));
        return value == RedisValue.Null ? null : Encoding.UTF8.GetString(LZ4Pickler.Unpickle(value));
    }

    public static async Task<bool> CompressedStringSetAsync(this IDatabase db, string key, string value, TimeSpan? expiry = null)
    {
        byte[] data = LZ4Pickler.Pickle(Encoding.UTF8.GetBytes(value));
        return await db.StringSetAsync(key, data, expiry);
    }
}
