using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Serilog;
using Wowthing.Backend.Extensions;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class JobQueueService : BackgroundService
{
    private readonly Dictionary<JobPriority, Channel<QueuedJob>> _channels = new();
    private readonly IDbContextFactory<WowDbContext> _contextFactory;
    private readonly ILogger _logger;
    private readonly StateService _stateService;

    public JobQueueService(
        IDbContextFactory<WowDbContext> contextFactory,
        StateService stateService
    )
    {
        _contextFactory = contextFactory;
        _stateService = stateService;

        _logger = Log.ForContext("Service", $"JobQueue");

        foreach (var priority in EnumUtilities.GetValues<JobPriority>())
        {
            var channel = _channels[priority] = Channel.CreateUnbounded<QueuedJob>(new UnboundedChannelOptions()
            {
                SingleReader = false,
                SingleWriter = true,
            });
            stateService.JobPriorityChannels[priority] = channel;
        }
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(5000, cancellationToken);

            await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

            var queuedJobs = await context.QueuedJob
                .FromSql($@"
WITH job_ids AS (
    SELECT  id
    FROM    queued_job
    WHERE   started_at IS NULL
    ORDER BY id
    FOR UPDATE SKIP LOCKED
    LIMIT 100
)
UPDATE  queued_job
SET     started_at = CURRENT_TIMESTAMP
WHERE   id = ANY(SELECT id FROM job_ids)
        AND started_at IS NULL
RETURNING *
")
                .ToArrayAsync(cancellationToken);
            foreach (var queuedJob in queuedJobs)
            {
                await _channels[queuedJob.Priority].Writer.WriteAsync(queuedJob, cancellationToken);
            }

            var successfulIds = _stateService.SuccessfulQueuedJobs.Reader.Flush();
            if (successfulIds.Count > 0)
            {
                await context.QueuedJob
                    .Where(qj => successfulIds.Contains(qj.Id))
                    .ExecuteDeleteAsync(cancellationToken);
            }

            var failedIds = _stateService.FailedQueuedJobs.Reader.Flush();
            if (failedIds.Count > 0)
            {
                await context.QueuedJob
                    .Where(qj => failedIds.Contains(qj.Id))
                    .ExecuteUpdateAsync(
                        setters => setters.SetProperty(qj => qj.Failures, qj => qj.Failures + 1),
                        cancellationToken
                    );
            }

            // await using var context = await _contextFactory.CreateDbContextAsync(jobTokenSource.Token);
            // await context.QueuedJob
            //     .Where(qj => qj.Id == queuedJob.Id)
            //     .ExecuteDeleteAsync(jobTokenSource.Token);


            // await using var context = await _contextFactory.CreateDbContextAsync(jobTokenSource.Token);
            // if (queuedJob.Failures >= 2)
            // {
            //     await context.QueuedJob
            //         .Where(qj => qj.Id == queuedJob.Id)
            //         .ExecuteDeleteAsync(jobTokenSource.Token);
            // }

            // Delete any jobs with too many failures
            await context.QueuedJob
                .Where(qj => qj.Failures >= 3)
                .ExecuteDeleteAsync(cancellationToken);

            // Reset any jobs that have been stuck for at least 4 hours
            int updated = await context.QueuedJob
                .Where(job => job.StartedAt.HasValue && job.StartedAt < DateTime.UtcNow.AddHours(-4))
                .ExecuteUpdateAsync(
                    s => s.SetProperty(job => job.StartedAt, job => null),
                    cancellationToken
                );
            if (updated > 0)
            {
                _logger.Warning("Reset {count} incomplete job(s)", updated);
            }
        }
    }
}
