/* prettier-ignore */
export enum ItemFlags {
    Cosmetic                 = 0b0000_0000_0000_0001,
    CannotTransmogToThisItem = 0b0000_0000_0000_0010,
    AllianceOnly             = 0b0000_0000_0000_0100,
    HordeOnly                = 0b0000_0000_0000_1000,
    LookingForRaidDifficulty = 0b0000_0000_0001_0000,
    HeroicDifficulty         = 0b0000_0000_0010_0000,
    MythicDifficulty         = 0b0000_0000_0100_0000,
    Openable                 = 0b0000_0000_1000_0000,
    BoundToAccount           = 0b0000_0001_0000_0000,
}
