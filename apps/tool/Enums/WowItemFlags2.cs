namespace Wowthing.Tool.Enums;

[Flags]
public enum WowItemFlags2
{
    HordeOnly = 0x1,
    AllianceOnly = 0x2,
    CannotTransmogThisItem = 0x200_000,
    CannotTransmogToThisItem = 0x400_000,
}
