using Microsoft.Extensions.Hosting;
using Serilog;

namespace Wowthing.Backend.Services.Base;

public abstract class TimerService : IHostedService, IDisposable
{
    protected readonly ILogger Logger;
    private readonly TimeSpan _initial;
    private readonly TimeSpan _interval;

    private Timer _timer;

    protected TimerService(string name, TimeSpan initial, TimeSpan interval)
    {
        Logger = Log.ForContext("Service", $"{name,-10}");
        _initial = initial;
        _interval = interval;
    }

    #region IHostedService
    public Task StartAsync(CancellationToken stoppingToken)
    {
        Logger.Information("Service starting");

        _timer = new Timer(TimerCallback, null, _initial, _interval);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        Logger.Information("Service stopping");

        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    }
    #endregion

    #region IDisposable
    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _timer?.Dispose();
        }

    }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    #endregion

    protected abstract void TimerCallback(object state);
}