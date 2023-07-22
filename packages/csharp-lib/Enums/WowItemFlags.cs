namespace Wowthing.Lib.Enums;

[Flags]
public enum WowItemFlags : short
{
    Cosmetic = 0b0001,
    CannotTransmogToThisItem = 0b0010,
}
