using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ServiceStack.Redis;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Repositories
{
    public class JobRepository
    {
        private readonly IRedisClientsManager _redis;
        private readonly string[] _queues;

        public JobRepository(IRedisClientsManager redis)
        {
            _redis = redis;

            _queues = ((JobPriority[])Enum.GetValues(typeof(JobPriority)))
                .Select(p => p.GetQueueName())
                .ToArray();
        }

        public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
        {
            var db = await _redis.GetClientAsync();

            var job = new WorkerJob
            {
                Type = type,
                Data = data,
            };
            await db.AddItemToListAsync(priority.GetQueueName(), JsonConvert.SerializeObject(job));
        }

        public async Task<WorkerJob> GetJobAsync(CancellationToken token)
        {
            var db = await _redis.GetClientAsync(token);
            var result = await db.BlockingRemoveStartFromListsAsync(_queues, null, token: token);
            if (!string.IsNullOrEmpty(result?.Item))
            {
                return JsonConvert.DeserializeObject<WorkerJob>(result.Item);
            }

            return null;
        }

        public async Task<bool> CheckLastTime(string prefix, string suffix, TimeSpan maximumAge)
        {
            var db = await _redis.GetClientAsync();
            string key = $"{prefix}:{suffix}";
            bool set;

            var result = await db.GetValueAsync(key);
            if (string.IsNullOrEmpty(result))
            {
                set = true;
            }
            else
            {
                var dto = DateTimeOffset.Parse(result);
                set = (DateTimeOffset.Now - dto) >= maximumAge;
            }

            if (set)
            {
                await db.SetValueAsync(key, DateTimeOffset.Now.ToString("O"), maximumAge);
            }
            return set;
        }

        public async Task<bool> AcquireLockAsync(string key, string value, TimeSpan expiry)
        {
            var db = await _redis.GetClientAsync();
            return await db.SetValueIfNotExistsAsync($"lock:{key}", value, expiry);
        }

        private const string _releaseScript = @"
if redis.call('GET', ARGV[1]) == ARGV[2] then
    return redis.call('DEL', ARGV[1])
end
";

        public async Task ReleaseLockAsync(string key, string value)
        {
            var db = await _redis.GetClientAsync();
            await db.ExecLuaAsync(_releaseScript, key, value);
        }
    }
}
