namespace Wowthing.Web.Models.Api;

public class ApiAuctionCommodities
{
    public Dictionary<short, Dictionary<int, int>> Regions { get; } = new();

    public ApiAuctionCommodities(short[] regions)
    {
        foreach (short region in regions)
        {
            Regions.Add(region, new());
        }
    }
}
