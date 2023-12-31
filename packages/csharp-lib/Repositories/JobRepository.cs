using System.Text.Json;
using StackExchange.Redis;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Repositories;

public class JobRepository(
    IConnectionMultiplexer redis,
    JsonSerializerOptions jsonSerializerOptions
)
{
    private static readonly Dictionary<JobPriority, string> _priorityToStream;

    static JobRepository()
    {
        _priorityToStream = new();
        foreach (var priority in Enum.GetValues<JobPriority>())
        {
            _priorityToStream[priority] = $"stream:{priority.ToString().ToLowerInvariant()}";
        }
    }

    public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
    {
        var db = redis.GetDatabase();
        var values = new[]
        {
            new NameValueEntry("type", type.ToString()),
            new NameValueEntry("data", JsonSerializer.Serialize(data.EmptyIfNull(), jsonSerializerOptions)),
        };

        await db.StreamAddAsync(_priorityToStream[priority], values);
    }

    public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string[]> datas)
    {
        foreach (var data in datas)
        {
            await AddJobAsync(priority, type, data);
        }
    }

    public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string> datas)
    {
        await AddJobsAsync(priority, type, datas.Select(d => new[] { d }));
    }

    public async Task AddImageJobAsync(ImageType imageType, int id, ImageFormat format, string url)
    {
        string[] data =
        {
            ((int)imageType).ToString(),
            id.ToString(),
            ((int)format).ToString(),
            url,
        };
        await AddJobAsync(JobPriority.Low, JobType.Image, data);
    }

    public async Task<bool> CheckLastTime(string prefix, string suffix, TimeSpan maximumAge)
    {
        var db = redis.GetDatabase();
        string key = $"{prefix}:{suffix}";
        bool set;

        var value = await db.StringGetAsync(key);
        if (value.IsNullOrEmpty)
        {
            set = true;
        }
        else
        {
            var dto = DateTimeOffset.Parse(value.ToString());
            set = (DateTimeOffset.Now - dto) >= maximumAge;
        }

        if (set)
        {
            await db.StringSetAsync(key, DateTimeOffset.Now.ToString("O"), maximumAge);
        }
        return set;
    }

    public async Task<bool> AcquireLockAsync(string key, string value, TimeSpan expiry)
    {
        var db = redis.GetDatabase();
        return await db.StringSetAsync($"lock:{key}", value, expiry, When.NotExists);
    }

    private const string ReleaseScript = @"
if redis.call(""GET"", @key) == @value then
    return redis.call(""DEL"", @key)
else
    return 0
end
";

    public async Task ReleaseLockAsync(string key, string value)
    {
        var db = redis.GetDatabase();
        var script = LuaScript.Prepare(ReleaseScript);
        await db.ScriptEvaluateAsync(script, new { key = $"lock:{key}", value });
    }
}
