namespace Wowthing.Lib.Enums;

[Flags]
public enum WowItemFlags : short
{
    Cosmetic = 0b00_00_00_01,
    CannotTransmogToThisItem = 0b00_00_00_10,
    AllianceOnly = 0b00_00_01_00,
    HordeOnly = 0b00_00_10_00,
    LookingForRaidDifficulty = 0b00_01_00_00,
    HeroicDifficulty = 0b00_10_00_00,
    MythicDifficulty = 0b01_00_00_00,
    Openable = 0b10_00_00_00,
}
