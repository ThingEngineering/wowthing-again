namespace Wowthing.Web.ViewModels;

public class AuctionsViewModel
{
    public readonly string AuctionHash;

    public AuctionsViewModel(Dictionary<string, string> hashes)
    {
        AuctionHash = hashes["Auction"];
    }
}
