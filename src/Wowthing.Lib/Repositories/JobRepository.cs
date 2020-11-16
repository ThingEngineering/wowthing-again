using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
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

        public async void AddJobAsync(JobType type, string data, JobPriority priority = JobPriority.Low)
        {
            var job = new WorkerJob
            {
                Type = type,
                Data = data,
                Priority = priority,
            };
            var database = _redis.GetDatabase();
            await database.JsonSetAsync(priority.GetQueueName(), job);
        }

        public async Task<WorkerJob> GetJobAsync()
        {
            var database = _redis.GetDatabase();
            foreach (var queueName in _queues)
            {
                var result = await database.ListLeftPopAsync(queueName);
                if (!result.IsNullOrEmpty)
                {
                    return JsonSerializer.Deserialize<WorkerJob>(result);
                }
            }

            return null;
        }
    }
}
