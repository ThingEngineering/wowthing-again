using System.Diagnostics.Metrics;

namespace Wowthing.Backend.Metrics;

public class JobMetrics
{
    private readonly Counter<int> _success;
    private readonly Counter<int> _fail;
    private readonly Counter<int> _count;
    private readonly Histogram<long> _duration;

    public JobMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("WoWthing.Backend.Jobs");

        _count = meter.CreateCounter<int>("wowthing.backend.jobs.count");
        _fail = meter.CreateCounter<int>("wowthing.backend.jobs.fail");
        _success = meter.CreateCounter<int>("wowthing.backend.jobs.success");

        _duration = meter.CreateHistogram<long>("wowthing.backend.jobs.duration");
    }

    public void Succeeded()
    {
        _success.Add(1);
    }

    public void Failed()
    {
        _fail.Add(1);
    }

    public void Started()
    {
        _count.Add(1);
    }

    public void Duration(long ms)
    {
        _duration.Record(ms);
    }
}
