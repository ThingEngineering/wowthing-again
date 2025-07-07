using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Data;

public static partial class Hardcoded
{
    private static readonly WowStat[] StatAgility = { WowStat.Agility };
    private static readonly WowStat[] StatAgilityIntellect = { WowStat.Agility, WowStat.Intellect };
    private static readonly WowStat[] StatIntellect = { WowStat.Intellect };
    private static readonly WowStat[] StatIntellectStrength = { WowStat.Intellect, WowStat.Strength };
    private static readonly WowStat[] StatStrength = { WowStat.Strength };
    private static readonly WowStat[] StatTransmogOnly = { WowStat.TransmogOnly };

    public static readonly List<CharacterClassData> Characters = new()
    {
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.DeathKnight,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatStrength),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatStrength),
                (WowWeaponSubclass.OneHandedMace, StatStrength),
                (WowWeaponSubclass.OneHandedSword, StatStrength),
                (WowWeaponSubclass.TwoHandedAxe, StatStrength),
                (WowWeaponSubclass.TwoHandedMace, StatStrength),
                (WowWeaponSubclass.TwoHandedSword, StatStrength),
                (WowWeaponSubclass.Polearm, StatStrength),

                (WowWeaponSubclass.OffHand, StatStrength),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.DemonHunter,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgility),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatAgility),
                (WowWeaponSubclass.OneHandedSword, StatAgility),
                (WowWeaponSubclass.Fist, StatAgility),
                (WowWeaponSubclass.Warglaive, StatAgility),

                (WowWeaponSubclass.OffHand, StatAgility),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Druid,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgilityIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedMace, StatIntellect),
                (WowWeaponSubclass.TwoHandedMace, StatAgilityIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Fist, StatIntellect),
                (WowWeaponSubclass.Polearm, StatAgilityIntellect),
                (WowWeaponSubclass.Staff, StatAgilityIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Evoker,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatIntellect),
                (WowWeaponSubclass.OneHandedMace, StatIntellect),
                (WowWeaponSubclass.OneHandedSword, StatIntellect),
                (WowWeaponSubclass.TwoHandedAxe, StatIntellect),
                (WowWeaponSubclass.TwoHandedMace, StatIntellect),
                (WowWeaponSubclass.TwoHandedSword, StatIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Fist, StatIntellect),
                (WowWeaponSubclass.Staff, StatIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Hunter,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgility),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.TwoHandedAxe, StatAgility),
                (WowWeaponSubclass.TwoHandedSword, StatAgility),
                (WowWeaponSubclass.Polearm, StatAgility),
                (WowWeaponSubclass.Staff, StatAgility),
                (WowWeaponSubclass.Bow, StatAgility),
                (WowWeaponSubclass.Crossbow, StatAgility),
                (WowWeaponSubclass.Gun, StatAgility),

                (WowWeaponSubclass.OneHandedAxe, StatTransmogOnly),
                (WowWeaponSubclass.OneHandedSword, StatTransmogOnly),
                (WowWeaponSubclass.Dagger, StatTransmogOnly),
                (WowWeaponSubclass.Fist, StatTransmogOnly),

                (WowWeaponSubclass.OffHand, StatAgility),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Mage,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedSword, StatIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Staff, StatIntellect),
                (WowWeaponSubclass.Wand, StatIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Monk,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgilityIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatAgilityIntellect),
                (WowWeaponSubclass.OneHandedMace, StatAgilityIntellect),
                (WowWeaponSubclass.OneHandedSword, StatAgilityIntellect),
                (WowWeaponSubclass.Fist, StatAgilityIntellect),
                (WowWeaponSubclass.Polearm, StatAgilityIntellect),
                (WowWeaponSubclass.Staff, StatAgilityIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Paladin,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatIntellectStrength),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
                (WowArmorSubclass.Shield, StatIntellectStrength),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatIntellectStrength),
                (WowWeaponSubclass.OneHandedMace, StatIntellectStrength),
                (WowWeaponSubclass.OneHandedSword, StatIntellectStrength),
                (WowWeaponSubclass.TwoHandedAxe, StatIntellectStrength),
                (WowWeaponSubclass.TwoHandedMace, StatIntellectStrength),
                (WowWeaponSubclass.TwoHandedSword, StatIntellectStrength),
                (WowWeaponSubclass.Polearm, StatIntellectStrength),

                (WowWeaponSubclass.OffHand, StatStrength),
                (WowWeaponSubclass.Shield, StatIntellectStrength),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Priest,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedMace, StatIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Staff, StatIntellect),
                (WowWeaponSubclass.Wand, StatIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Rogue,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgility),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatAgility),
                (WowWeaponSubclass.OneHandedMace, StatAgility),
                (WowWeaponSubclass.OneHandedSword, StatAgility),
                (WowWeaponSubclass.Dagger, StatAgility),
                (WowWeaponSubclass.Fist, StatAgility),

                (WowWeaponSubclass.Bow, StatTransmogOnly),
                (WowWeaponSubclass.Crossbow, StatTransmogOnly),
                (WowWeaponSubclass.Gun, StatTransmogOnly),
                (WowWeaponSubclass.Thrown, StatTransmogOnly),

                (WowWeaponSubclass.OffHand, StatAgility),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Shaman,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatAgilityIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
                (WowArmorSubclass.Shield, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatAgilityIntellect),
                (WowWeaponSubclass.OneHandedMace, StatAgilityIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Fist, StatAgilityIntellect),
                (WowWeaponSubclass.Staff, StatIntellect),

                (WowWeaponSubclass.TwoHandedAxe, StatTransmogOnly),
                (WowWeaponSubclass.TwoHandedMace, StatTransmogOnly),

                (WowWeaponSubclass.OffHand, StatIntellect),
                (WowWeaponSubclass.Shield, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Warlock,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatIntellect),
                (WowArmorSubclass.Miscellaneous, StatIntellect),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedSword, StatIntellect),
                (WowWeaponSubclass.Dagger, StatIntellect),
                (WowWeaponSubclass.Staff, StatIntellect),
                (WowWeaponSubclass.Wand, StatIntellect),

                (WowWeaponSubclass.OffHand, StatIntellect),
            },
        },
        new CharacterClassData
        {
            Mask = WowCharacterClassMask.Warrior,
            ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
            {
                (WowArmorSubclass.Cloak, StatStrength),
                (WowArmorSubclass.Shield, StatStrength),
            },
            WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
            {
                (WowWeaponSubclass.OneHandedAxe, StatStrength),
                (WowWeaponSubclass.OneHandedMace, StatStrength),
                (WowWeaponSubclass.OneHandedSword, StatStrength),
                (WowWeaponSubclass.TwoHandedAxe, StatStrength),
                (WowWeaponSubclass.TwoHandedMace, StatStrength),
                (WowWeaponSubclass.TwoHandedSword, StatStrength),
                (WowWeaponSubclass.Dagger, StatStrength),
                (WowWeaponSubclass.Fist, StatStrength),
                (WowWeaponSubclass.Polearm, StatStrength),
                (WowWeaponSubclass.Staff, StatStrength),

                (WowWeaponSubclass.Bow, StatTransmogOnly),
                (WowWeaponSubclass.Crossbow, StatTransmogOnly),
                (WowWeaponSubclass.Gun, StatTransmogOnly),
                (WowWeaponSubclass.Thrown, StatTransmogOnly),

                (WowWeaponSubclass.OffHand, StatStrength),
                (WowWeaponSubclass.Shield, StatStrength),
            },
        },
    };

    public class CharacterClassData
    {
        public WowCharacterClassMask Mask;
        public List<(WowArmorSubclass, WowStat[])> ArmorTypes;
        public List<(WowWeaponSubclass, WowStat[])> WeaponTypes;
    }
}
