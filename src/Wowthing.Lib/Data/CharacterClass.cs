using System.Collections.Generic;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Data
{
    public static partial class Hardcoded
    {
        public static readonly List<CharacterClassData> Characters = new()
        {
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.DeathKnight,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedAxe, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedMace, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedSword, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Strength }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.DemonHunter,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Warglaive, new[] { WowStat.Agility }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Druid,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.TwoHandedMace, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Agility, WowStat.Intellect }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Hunter,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.TwoHandedAxe, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.TwoHandedSword, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Bow, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Crossbow, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Gun, new[] { WowStat.Agility }),
                    
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.TransmogOnly }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Mage,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Wand, new[] { WowStat.Intellect }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Monk,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Agility, WowStat.Intellect }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Paladin,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                    (WowArmorSubclass.Shield, new[] { WowStat.Intellect, WowStat.Strength }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedAxe, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedMace, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedSword, new[] { WowStat.Intellect, WowStat.Strength }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Intellect, WowStat.Strength }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Priest,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Wand, new[] { WowStat.Intellect }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Rogue,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Agility }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Agility }),
                    
                    (WowWeaponSubclass.Bow, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Crossbow, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Gun, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Thrown, new[] { WowStat.TransmogOnly }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Shaman,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                    (WowArmorSubclass.Shield, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Agility, WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Intellect }),
                    
                    (WowWeaponSubclass.TwoHandedAxe, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.TwoHandedMace, new[] { WowStat.TransmogOnly }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Warlock,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Miscellaneous, new[] { WowStat.Intellect }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Intellect }),
                    (WowWeaponSubclass.Wand, new[] { WowStat.Intellect }),
                },
            },
            new CharacterClassData
            {
                Mask = WowCharacterClassMask.Warrior,
                ArmorTypes = new List<(WowArmorSubclass, WowStat[])>
                {
                    (WowArmorSubclass.Shield, new[] { WowStat.Strength }),
                },
                WeaponTypes = new List<(WowWeaponSubclass, WowStat[])>
                {
                    (WowWeaponSubclass.OneHandedAxe, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedMace, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.OneHandedSword, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedAxe, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedMace, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.TwoHandedSword, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.Dagger, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.Fist, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.Polearm, new[] { WowStat.Strength }),
                    (WowWeaponSubclass.Stave, new[] { WowStat.Strength }),
                    
                    (WowWeaponSubclass.Bow, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Crossbow, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Gun, new[] { WowStat.TransmogOnly }),
                    (WowWeaponSubclass.Thrown, new[] { WowStat.TransmogOnly }),
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
}
