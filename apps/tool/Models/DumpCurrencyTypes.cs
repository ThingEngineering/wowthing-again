// ReSharper disable InconsistentNaming

using CsvHelper.Configuration.Attributes;
using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models;

public class DumpCurrencyTypes
{
    public short ID { get; set; }

    public short CategoryID { get; set; }
    public short RechargingAmountPerCycle { get; set; }
    public int MaxEarnablePerWeek { get; set; }
    public int MaxQty { get; set; }
    public double WarbondTransferPercentage { get; set; }
    public long RechargingCycleDurationMS { get; set; }

    [Name("Flags[0]")]
    public WowCurrencyFlags1 Flags1 { get; set; }

    [Name("Flags[1]")]
    public int Flags2 { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;
}
