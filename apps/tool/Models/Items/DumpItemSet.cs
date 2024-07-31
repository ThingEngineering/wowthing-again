using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Items;

// ReSharper disable InconsistentNaming
public class DumpItemSet
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("ItemID[0]")]
    public int ItemID0 { get; set; }

    [Name("ItemID[1]")]
    public int ItemID1 { get; set; }

    [Name("ItemID[2]")]
    public int ItemID2 { get; set; }

    [Name("ItemID[3]")]
    public int ItemID3 { get; set; }

    [Name("ItemID[4]")]
    public int ItemID4 { get; set; }

    [Name("ItemID[5]")]
    public int ItemID5 { get; set; }

    [Name("ItemID[6]")]
    public int ItemID6 { get; set; }

    [Name("ItemID[7]")]
    public int ItemID7 { get; set; }

    [Name("ItemID[8]")]
    public int ItemID8 { get; set; }

    [Name("ItemID[9]")]
    public int ItemID9 { get; set; }

    [Name("ItemID[10]")]
    public int ItemID10 { get; set; }

    [Name("ItemID[11]")]
    public int ItemID11 { get; set; }

    [Name("ItemID[12]")]
    public int ItemID12 { get; set; }

    [Name("ItemID[13]")]
    public int ItemID13 { get; set; }

    [Name("ItemID[14]")]
    public int ItemID14 { get; set; }

    [Name("ItemID[15]")]
    public int ItemID15 { get; set; }

    [Name("ItemID[16]")]
    public int ItemID16 { get; set; }

    public int[] ItemIDs
    {
        get
        {
            return new[]
                {
                    ItemID0,
                    ItemID1,
                    ItemID2,
                    ItemID3,
                    ItemID4,
                    ItemID5,
                    ItemID6,
                    ItemID7,
                    ItemID8,
                    ItemID9,
                    ItemID10,
                    ItemID11,
                    ItemID12,
                    ItemID13,
                    ItemID14,
                    ItemID15,
                    ItemID16,
                }
                .Where(id => id > 0)
                .ToArray();
        }
    }
}
