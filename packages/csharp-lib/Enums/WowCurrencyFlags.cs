namespace Wowthing.Lib.Enums;

[Flags]
public enum WowCurrencyFlags : short
{
    Tradable = 0b00_00_00_01,
    ComputedWeeklyMaximum = 0b00_00_00_10,
    ScaledBy100 = 0b00_00_01_00,
    AccountWide = 0b00_00_10_00,
    AllianceOnly = 0b00_01_00_00,
    HordeOnly = 0b00_10_00_00,
}
