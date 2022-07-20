using CsvHelper.Configuration.Attributes;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data;

// ReSharper disable InconsistentNaming
public class DumpChrRaces
{
    public short ID { get; set; }
    public short PlayableRaceBit { get; set; }

    [Name("Alliance")]
    public WowFaction Faction { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; }

    [Name("Name_female_lang")]
    public string FemaleName { get; set; }
}
