using System;

namespace Wowthing.Lib.Enums
{
    [Flags]
    public enum WowCharacterClassMask : int
    {
        Warrior = 1,
        Paladin = 2,
        Hunter = 4,
        Rogue = 8,
        Priest = 16,
        DeathKnight = 32,
        Shaman = 64,
        Mage = 128,
        Warlock = 256,
        Monk = 512,
        Druid = 1024,
        DemonHunter = 2048,
    }
}
