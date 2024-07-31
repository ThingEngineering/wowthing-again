using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Heirlooms;

// ReSharper disable InconsistentNaming
public class DumpHeirloom
{
    public int ID { get; set; }

    public int ItemID { get; set; }

    [Name("UpgradeItemBonusListID[0]")]
    public int UpgradeBonusID0 { get; set; }

    [Name("UpgradeItemBonusListID[1]")]
    public int UpgradeBonusID1 { get; set; }

    [Name("UpgradeItemBonusListID[2]")]
    public int UpgradeBonusID2 { get; set; }

    [Name("UpgradeItemBonusListID[3]")]
    public int UpgradeBonusID3 { get; set; }

    [Name("UpgradeItemBonusListID[4]")]
    public int UpgradeBonusID4 { get; set; }

    [Name("UpgradeItemBonusListID[5]")]
    public int UpgradeBonusID5 { get; set; }

    public IEnumerable<int> UpgradeBonusIDs => new[]
    {
        UpgradeBonusID0,
        UpgradeBonusID1,
        UpgradeBonusID2,
        UpgradeBonusID3,
        UpgradeBonusID4,
        UpgradeBonusID5,
    }.Where(id => id > 0);


    [Name("UpgradeItemID[0]")]
    public int UpgradeItemID0 { get; set; }

    [Name("UpgradeItemID[1]")]
    public int UpgradeItemID1 { get; set; }

    [Name("UpgradeItemID[2]")]
    public int UpgradeItemID2 { get; set; }

    [Name("UpgradeItemID[3]")]
    public int UpgradeItemID3 { get; set; }

    [Name("UpgradeItemID[4]")]
    public int UpgradeItemID4 { get; set; }

    [Name("UpgradeItemID[5]")]
    public int UpgradeItemID5 { get; set; }

    public IEnumerable<int> UpgradeItemIDs => new[]
    {
        UpgradeItemID0,
        UpgradeItemID1,
        UpgradeItemID2,
        UpgradeItemID3,
        UpgradeItemID4,
        UpgradeItemID5,
    }.Where(id => id > 0);
}
