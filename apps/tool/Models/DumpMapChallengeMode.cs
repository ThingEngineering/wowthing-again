using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpMapChallengeMode
{
    public short ID { get; set; }

    public short ExpansionLevel { get; set; }
    public short Flags { get; set; }
    public short MapID { get; set; }

    [Name("CriteriaCount[0]")]
    public short CriteriaCount1 { get; set; }

    [Name("CriteriaCount[1]")]
    public short CriteriaCount2 { get; set; }

    [Name("CriteriaCount[2]")]
    public short CriteriaCount3 { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
