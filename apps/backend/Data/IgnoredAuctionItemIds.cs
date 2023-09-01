namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredAuctionItemIds = new()
    {
         16072, // Expert Cookbook
         27736, // Master Cookbook
         87213, // Mist-Piercing Goggles - not BoE so not learnable
        158078, // Cracked Overlord's Scepter - not BoE so not learnable
    };
}
