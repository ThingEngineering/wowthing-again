using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpChrRaces
{
    public short ID { get; set; }
    public short PlayableRaceBit { get; set; }

    [Name("Alliance")]
    public WowFaction Faction { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("Name_female_lang")]
    public string FemaleName { get; set; } = string.Empty;
}
