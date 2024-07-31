using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.CollectableSource;

// ReSharper disable InconsistentNaming
public class DumpCollectableSourceVendorSparse
{
    public int ID { get; set; }

    public int AreaTableID { get; set; }
    public int CollectableSourceInfoID { get; set; }
    public int CreatureID { get; set; }
    public int VendorItemID { get; set; }
    public int VendorMapID { get; set; }
    public int WMOGroupID { get; set; }

    [Name("VendorPosition[0]")]
    public double VendorPosition0 { get; set; }

    [Name("VendorPosition[1]")]
    public double VendorPosition1 { get; set; }

    [Name("VendorPosition[2]")]
    public double VendorPosition2 { get; set; }
}
