using System.Runtime;
using Wowthing.Backend.Services.Base;

namespace Wowthing.Backend.Services;

public sealed class GarbageService : TimerService
{
    #if DEBUG
    private const int GcAnnounceMinimum = 0;
    #else
    private const int GcAnnounceMinimum = 10 * 1024 * 1024;
    #endif

    private static readonly TimeSpan TimerInterval = TimeSpan.FromMinutes(1);

    public GarbageService() : base("Garbage", TimeSpan.Zero, TimerInterval)
    {
    }

    protected override void TimerCallback(object state)
    {
        long preGc = GC.GetTotalMemory(false);
        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
        long postGc = GC.GetTotalMemory(true);
        long diff = preGc - postGc;
        if (diff > GcAnnounceMinimum)
        {
            Logger.Information(
                "Freed {diff:n0} bytes (pre={pre:n0} post={post:n0})",
                diff,
                preGc,
                postGc
            );
        }
    }
}
