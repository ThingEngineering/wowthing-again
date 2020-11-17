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

        public async Task AddJobAsync(JobPriority priority, JobType type, params string[] data)
        {
            var database = _redis.GetDatabase();

            var job = new WorkerJob
            {
                Type = type,
                Data = data,
            };
            await database.ListRightPushAsync(priority.GetQueueName(), JsonSerializer.Serialize(job));
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
