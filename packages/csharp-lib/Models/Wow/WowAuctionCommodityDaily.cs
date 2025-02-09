namespace Wowthing.Lib.Models.Wow;

public class WowAuctionCommodityDaily
{
    public DateOnly Date { get; set; }
    public int ItemId { get; set; }
    public int ListedMin { get; set; }
    public int ListedMax { get; set; }
    public short Region { get; set; }
    public List<int> AvgData { get; set; }
    public List<int> MaxData { get; set; }
    public List<int> MinData { get; set; }
}
