using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Reputations;

// ReSharper disable InconsistentNaming
public class DumpFaction
{
    public short ID { get; set; }
    public short Expansion { get; set; }
    public int Flags { get; set; }
    public short FriendshipRepID { get; set; }
    public short ParagonFactionID { get; set; }
    public short ParentFactionID { get; set; }
    public short RenownCurrencyID { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("ReputationBase[0]")]
    public int ReputationBase0 { get; set; }

    [Name("ReputationBase[1]")]
    public int ReputationBase1 { get; set; }

    [Name("ReputationBase[2]")]
    public int ReputationBase2 { get; set; }

    [Name("ReputationBase[3]")]
    public int ReputationBase3 { get; set; }

    public List<int> ReputationBases => new()
    {
        ReputationBase0,
        ReputationBase1,
        ReputationBase2,
        ReputationBase3,
    };
    [Name("ReputationMax[0]")]
    public int ReputationMax0 { get; set; }

    [Name("ReputationMax[1]")]
    public int ReputationMax1 { get; set; }

    [Name("ReputationMax[2]")]
    public int ReputationMax2 { get; set; }

    [Name("ReputationMax[3]")]
    public int ReputationMax3 { get; set; }

    public List<int> ReputationMaxes => new()
    {
        ReputationMax0,
        ReputationMax1,
        ReputationMax2,
        ReputationMax3,
    };
}
