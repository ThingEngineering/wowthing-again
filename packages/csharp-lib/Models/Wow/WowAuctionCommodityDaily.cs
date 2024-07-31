namespace Wowthing.Lib.Models.Wow;

public class WowAuctionCommodityDaily
{
    public DateOnly Date { get; set; }
    public int ItemId { get; set; }
    public int ListedMin { get; set; }
    public int ListedMax { get; set; }
    public int Average10Min { get; set; }
    public int Average10Max { get; set; }
    public int Average100Min { get; set; }
    public int Average100Max { get; set; }
    public int Average1000Min { get; set; }
    public int Average1000Max { get; set; }
    public int Average10000Min { get; set; }
    public int Average10000Max { get; set; }
    public short Region { get; set; }
}
