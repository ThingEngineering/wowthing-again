namespace Wowthing.Web.ViewModels;

public class AuctionsViewModel
{
    public readonly string AuctionHash;
    public readonly string ItemHash;

    public AuctionsViewModel(Dictionary<string, string> hashes)
    {
        AuctionHash = hashes["Auction"];
        ItemHash = hashes["Item"];
    }
}
