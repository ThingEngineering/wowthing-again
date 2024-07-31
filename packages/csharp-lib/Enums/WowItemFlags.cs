namespace Wowthing.Lib.Enums;

[Flags]
public enum WowItemFlags : short
{
    Cosmetic = 0b0001,
    CannotTransmogToThisItem = 0b0010,
    AllianceOnly = 0b0100,
    HordeOnly = 0b1000,
}
