using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Repositories
{
    public class JobRepository
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly string[] _queues;

        public JobRepository(IConnectionMultiplexer redis)
        {
            _redis = redis;

            _queues = ((JobPriority[])Enum.GetValues(typeof(JobPriority)))
                .Select(p => p.GetQueueName())
                .ToArray();
        }

        public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
        {
            var database = _redis.GetDatabase();

            var job = new WorkerJob
            {
                Type = type,
                Data = data,
            };
            await database.ListRightPushAsync(priority.GetQueueName(), JsonConvert.SerializeObject(job));
        }

        public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string[]> datas)
        {
            var db = _redis.GetDatabase();
            var jobs = datas.Select(data => new RedisValue(JsonConvert.SerializeObject(new WorkerJob
            {
                Type = type,
                Data = data,
            }))).ToArray();
            await db.ListRightPushAsync(priority.GetQueueName(), jobs, When.Always);
        }

        public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string> datas)
        {
            await AddJobsAsync(priority, type, datas.Select(d => new string[] { d }));
        }

        public async Task<WorkerJob> GetJobAsync()
        {
            var database = _redis.GetDatabase();

            foreach (var queueName in _queues)
            {
                var result = await database.ListLeftPopAsync(queueName);
                if (!result.IsNullOrEmpty)
                {
                    return JsonConvert.DeserializeObject<WorkerJob>(result);
                }
            }

            return null;
        }

        public async Task<bool> CheckLastTime(string prefix, string suffix, TimeSpan maximumAge)
        {
            var db = _redis.GetDatabase();
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
            var db = _redis.GetDatabase();
            return await db.StringSetAsync($"lock:{key}", value, expiry, When.NotExists);
        }

        private const string _releaseScript = @"
if redis.call(""GET"", @key) == @value then
    return redis.call(""DEL"", @key)
else
    return 0
end
";

        public async Task ReleaseLockAsync(string key, string value)
        {
            var db = _redis.GetDatabase();
            var script = LuaScript.Prepare(_releaseScript);
            await db.ScriptEvaluateAsync(script, new { key = $"lock:{key}", value });
        }
    }
}
