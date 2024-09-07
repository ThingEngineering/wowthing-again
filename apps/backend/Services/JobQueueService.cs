using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Serilog;
using Wowthing.Backend.Extensions;
using Wowthing.Backend.Models;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class JobQueueService : BackgroundService
{
    private readonly IDbContextFactory<WowDbContext> _contextFactory;
    private readonly ILogger _logger;
    private readonly StateService _stateService;

    private readonly WowthingBackendOptions _backendOptions;
    private readonly JobPriority _priority;

    private const int SleepInterval = 5000;

    public JobQueueService(
        JobPriority priority,
        IDbContextFactory<WowDbContext> contextFactory,
        IOptions<WowthingBackendOptions> backendOptions,
        StateService stateService
    )
    {
        _priority = priority;
        _contextFactory = contextFactory;
        _backendOptions = backendOptions.Value;
        _stateService = stateService;

        _logger = Log.ForContext("Service", $"Queue {_priority.ToString()[..Math.Min(4, _priority.ToString().Length)]}");
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        int jobLimit = _priority switch
        {
            JobPriority.Auction => _backendOptions.WorkerMaxAuction * 5 * SleepInterval / 1000,
            JobPriority.High => _backendOptions.WorkerMaxHigh * 5 * SleepInterval / 1000,
            JobPriority.Low => _backendOptions.WorkerMaxLow * 10 * SleepInterval / 1000,
            JobPriority.Bulk => _backendOptions.WorkerMaxBulk * 10 * SleepInterval / 1000,
            _ => throw new NotImplementedException(),
        };

        _logger.Information("Service starting with job limit {limit}", jobLimit);

        var channel = _stateService.JobPriorityChannels[_priority];
        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(SleepInterval, cancellationToken);

            await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

            int querySize = Math.Max(1, jobLimit - channel.Reader.Count);

            var queuedJobs = await context.QueuedJob
                .FromSql($@"
WITH job_ids AS (
    SELECT  id
    FROM    queued_job
    WHERE   priority = {_priority}
            AND started_at IS NULL
    ORDER BY id
    FOR UPDATE SKIP LOCKED
    LIMIT {querySize}
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
                await channel.Writer.WriteAsync(queuedJob, cancellationToken);
            }

            if (_priority == JobPriority.High)
            {
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

                // Delete any jobs with too many failures
                await context.QueuedJob
                    .Where(qj => qj.Failures >= 3 || (qj.Failures >= 1 && qj.Priority == JobPriority.Low))
                    .ExecuteDeleteAsync(cancellationToken);

                // Reset any jobs that have been stuck for at least 10 minutes
                int updated = await context.QueuedJob
                    .Where(job => job.StartedAt.HasValue && job.StartedAt < DateTime.UtcNow.AddMinutes(-10))
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
}
