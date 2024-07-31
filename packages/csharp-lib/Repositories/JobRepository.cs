using System.Text.Json;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Repositories;

public class JobRepository(
    IConnectionMultiplexer redis,
    JsonSerializerOptions jsonSerializerOptions,
    IDbContextFactory<WowDbContext> contextFactory
)
{
    private static readonly Dictionary<JobPriority, string> PriorityToStream;

    static JobRepository()
    {
        PriorityToStream = new();
        foreach (var priority in Enum.GetValues<JobPriority>())
        {
            PriorityToStream[priority] = $"stream:{priority.ToString().ToLowerInvariant()}";
        }
    }

    public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
    {
        await using var context = await contextFactory.CreateDbContextAsync();

        context.QueuedJob.Add(new QueuedJob
        {
            Priority = priority,
            Type = type,
            Data = JsonSerializer.Serialize(data.EmptyIfNull(), jsonSerializerOptions)
        });
        await context.SaveChangesAsync();
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
