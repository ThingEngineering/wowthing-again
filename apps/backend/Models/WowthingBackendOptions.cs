namespace Wowthing.Backend.Models;

public class WowthingBackendOptions
{
    public int ApiRateLimit { get; set; }
    public int WorkerMaxAuction { get; set; }
    public int WorkerMaxBulk { get; set; }
    public int WorkerMaxHigh { get; set; }
    public int WorkerMaxLow { get; set; }
    public string ImageAccessKeyId { get; set; }
    public string ImageSecretAccessKey { get; set; }
    public string ImageEndpoint { get; set; }
    public string ImageBucket { get; set; }
    public List<string> AllAuctionRegions { get; set; }
}
