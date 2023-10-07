namespace Wowthing.Backend.Models;

public class WowthingBackendOptions
{
    public List<string> AllAuctionRegions { get; set; }
    public int ApiRateLimit { get; set; }
    public int WorkerCountLow { get; set; }
    public int WorkerCountHigh { get; set; }
    public int WorkerCountAuction { get; set; }
}
