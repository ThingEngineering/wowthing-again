﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Jobs;

namespace Wowthing.Lib.Repositories
{
    public class JobRepository
    {
        private readonly IConnectionMultiplexer _redis;

        public JobRepository(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
        {
            var sub = _redis.GetSubscriber();
            var job = new WorkerJob
            {
                Type = type,
                Data = data,
            };
            await sub.PublishAsync("jobs", JsonConvert.SerializeObject(job));
        }

        public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string[]> datas)
        {
            var sub = _redis.GetSubscriber();
            foreach (var data in datas)
            {
                var job = new WorkerJob
                {
                    Type = type,
                    Data = data,
                };
                await sub.PublishAsync("jobs", JsonConvert.SerializeObject(job));
            }
        }

        public async Task AddJobsAsync(JobPriority priority, JobType type, IEnumerable<string> datas)
        {
            await AddJobsAsync(priority, type, datas.Select(d => new[] { d }));
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

        private const string ReleaseScript = @"
if redis.call(""GET"", @key) == @value then
    return redis.call(""DEL"", @key)
else
    return 0
end
";

        public async Task ReleaseLockAsync(string key, string value)
        {
            var db = _redis.GetDatabase();
            var script = LuaScript.Prepare(ReleaseScript);
            await db.ScriptEvaluateAsync(script, new { key = $"lock:{key}", value });
        }
    }
}
