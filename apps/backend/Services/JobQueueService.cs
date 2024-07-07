using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class JobQueueService : BackgroundService
{
    private readonly IDbContextFactory<WowDbContext> _contextFactory;
    private readonly ILogger _logger;

    public JobQueueService(
        IDbContextFactory<WowDbContext> contextFactory
    )
    {
        _contextFactory = contextFactory;

        _logger = Log.ForContext("Service", $"JobQueue");
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(10000, cancellationToken);

            await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

            // Reset any jobs that have been stuck for at least 5 minutes
            int updated = await context.QueuedJob
                .Where(job => job.StartedAt.HasValue && job.StartedAt < DateTime.UtcNow.AddMinutes(5))
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
