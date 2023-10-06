using Wowthing.Tool.Converters.Auctions;

namespace Wowthing.Tool.Models.Auctions;

[JsonConverter(typeof(OutAuctionCategoryConverter))]
public class OutAuctionCategory : IComparable<OutAuctionCategory>
{
    public int Id { get; set; }
    public int DefaultAuctionHouseFilter { get; set; }
    public int InventoryType { get; set; }
    public int ItemClass { get; set; }
    public int ItemSubClass { get; set; }
    public int Order { get; set; }
    public string Description { get; set; }

    public List<OutAuctionCategory> Children { get; } = new();

    public OutAuctionCategory(DumpAuctionHouseCategory category)
    {
        Id = category.ID;
        DefaultAuctionHouseFilter = category.DefaultAuctionHouseFilter;
        InventoryType = category.InventoryType;
        ItemClass = category.ItemClass;
        ItemSubClass = category.ItemSubClass;
        Order = category.OrderIndex;
        Description = category.Description;
    }

    public int CompareTo(OutAuctionCategory? other) => other == null ? 1 : Order.CompareTo(other.Order);
}
