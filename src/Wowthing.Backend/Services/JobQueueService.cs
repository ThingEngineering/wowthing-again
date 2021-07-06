using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Services
{
    public class JobQueueService : BackgroundService
    {
        private readonly Channel<WorkerJob> _channel;
        private readonly JobRepository _jobRepository;

        public JobQueueService(JobRepository jobRepository, StateService stateService)
        {
            _jobRepository = jobRepository;

            _channel = Channel.CreateUnbounded<WorkerJob>(new UnboundedChannelOptions
            {
                SingleReader = false,
                SingleWriter = true,
            });
            
            stateService.JobQueueReader = _channel.Reader;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(10, stoppingToken);

                var result = await _jobRepository.GetJobAsync();
                if (result == null)
                {
                    continue;
                }

                await _channel.Writer.WriteAsync(result, stoppingToken);
            }
        }
    }
}
