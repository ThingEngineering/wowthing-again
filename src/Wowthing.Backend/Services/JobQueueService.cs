using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services
{
    public class JobQueueService : BackgroundService
    {
        private Dictionary<JobPriority, Channel<WorkerJob>> _channels = new();
        
        public JobQueueService(StateService stateService, IConnectionMultiplexer redis)
        {
            foreach (var priority in EnumUtilities.GetValues<JobPriority>())
            {
                _channels[priority] = Channel.CreateUnbounded<WorkerJob>(new UnboundedChannelOptions
                {
                    SingleReader = false,
                    SingleWriter = false,
                });
                stateService.JobQueueReaders[priority] = _channels[priority].Reader;
            }

            redis.GetSubscriber().Subscribe("jobs").OnMessage(async msg =>
            {
                var job = JsonConvert.DeserializeObject<WorkerJob>(msg.Message);
                await _channels[job.Priority].Writer.WriteAsync(job);
            });
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(10000, stoppingToken);
            }
        }
    }
}
