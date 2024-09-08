namespace Wowthing.Backend.Models;

public class WowthingBackendOptions
{
    public List<string> AllAuctionRegions { get; set; }
    public int ApiRateLimit { get; set; }
    public int WorkerMaxAuction { get; set; }
    public int WorkerMaxBulk { get; set; }
    public int WorkerMaxHigh { get; set; }
    public int WorkerMaxLow { get; set; }
}
