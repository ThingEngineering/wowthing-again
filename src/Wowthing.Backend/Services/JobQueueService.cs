using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Services
{
    public class JobQueueService : BackgroundService
    {
        public JobQueueService(StateService stateService, IConnectionMultiplexer redis)
        {
            var channel = Channel.CreateUnbounded<WorkerJob>(new UnboundedChannelOptions
            {
                SingleReader = false,
                SingleWriter = false,
            });
            
            redis.GetSubscriber().Subscribe("jobs").OnMessage(async msg =>
            {
                var job = JsonConvert.DeserializeObject<WorkerJob>(msg.Message);
                await channel.Writer.WriteAsync(job);
            });
            
            stateService.JobQueueReader = channel.Reader;
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
