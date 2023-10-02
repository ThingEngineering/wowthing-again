using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Auctions;

// ReSharper disable InconsistentNaming
public class DumpAuctionHouseCategory
{
    public int ID { get; set; }

    public int InventoryType { get; set; }
    public int ItemClass { get; set; }
    public int ItemSubClass { get; set; }
    public int OrderIndex { get; set; }
    public int ParentCategory { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("SortedProperty_lang")]
    public string SortedProperty { get; set; } = string.Empty;
}
