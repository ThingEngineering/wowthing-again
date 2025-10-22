namespace Wowthing.Tool.Enums;

[Flags]
public enum WowCurrencyFlags1
{
    Tradable = 0x1,
    ComputedWeeklyMaximum = 0x4,
    ScaledBy100 = 0x8,
    AccountWide = 0x1000000,
    AllianceOnly = 0x10000000,
    HordeOnly = 0x20000000,
}
