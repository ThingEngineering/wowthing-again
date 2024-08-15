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

    private const string QueuedJobUniqueConstraint = "ix_queued_job_priority_type_data_hash";

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

        string json = JsonSerializer.Serialize(data.EmptyIfNull(), jsonSerializerOptions);
        string jsonHash = json.Sha256();

        await context.Database.ExecuteSqlInterpolatedAsync($@"
INSERT INTO queued_job (priority, type, data, data_hash)
VALUES ({priority}, {type}, {json}, {jsonHash})
ON CONFLICT DO NOTHING");
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
        return await db.LockTakeAsync($"lock:{key}", value, expiry);
        // return await db.StringSetAsync($"lock:{key}", value, expiry, When.NotExists);
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
        await db.LockReleaseAsync($"lock:{key}", value);
        // var script = LuaScript.Prepare(ReleaseScript);
        // await db.ScriptEvaluateAsync(script, new { key = $"lock:{key}", value });
    }
}
