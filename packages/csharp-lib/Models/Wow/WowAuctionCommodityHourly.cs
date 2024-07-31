namespace Wowthing.Lib.Models.Wow;

public class WowAuctionCommodityHourly
{
    public DateTime Timestamp { get; set; }
    public int ItemId { get; set; }
    public int Listed { get; set; }
    public short Region { get; set; }
    public List<int> Data { get; set; }
}
