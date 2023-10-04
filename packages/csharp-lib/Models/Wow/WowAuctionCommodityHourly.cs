namespace Wowthing.Lib.Models.Wow;

public class WowAuctionCommodityHourly
{
    public DateTime Timestamp { get; set; }
    public int ItemId { get; set; }
    public int Listed { get; set; }
    public int Average10 { get; set; }
    public int Average100 { get; set; }
    public int Average1000 { get; set; }
    public int Average10000 { get; set; }
    public short Region { get; set; }
}
