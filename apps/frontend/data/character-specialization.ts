import { PrimaryStat } from '@/enums/primary-stat';
import { WeaponSubclass } from '@/enums/weapon-subclass';

interface SpecializationData {
    dualWield?: boolean;
    primaryStat: PrimaryStat;
    weaponTypes: WeaponSubclass[];
}

export const specializationData: Record<number, SpecializationData> = {
    // Death Knight - Bloody
    250: {
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.Polearm,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Death Knight - Frost
    251: {
        dualWield: true,
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Polearm,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Demon Hunter - Havoc
    577: {
        dualWield: true,
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Warglaive,
        ],
    },
    // Druid - Balance
    102: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.Polearm,
            WeaponSubclass.Stave,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.HeldInOffHand,
        ],
    },
    // Druid - Feral
    103: {
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [WeaponSubclass.Polearm, WeaponSubclass.Stave, WeaponSubclass.TwoHandedMace],
    },
    // Evoker - Devastation
    1467: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Stave,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
            WeaponSubclass.HeldInOffHand,
        ],
    },
    // Hunter - Beast Mastery
    253: {
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [WeaponSubclass.Bow, WeaponSubclass.Crossbow, WeaponSubclass.Gun],
    },
    // Hunter - Survival
    255: {
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [
            WeaponSubclass.Polearm,
            WeaponSubclass.Stave,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Mage - Arcane
    62: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Stave,
            WeaponSubclass.Wand,
            WeaponSubclass.HeldInOffHand,
        ],
    },
    // Monk - Brewmaster
    268: {
        dualWield: true,
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Polearm,
            WeaponSubclass.Stave,
        ],
    },
    // Monk - Mistweaver
    270: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Stave,
            WeaponSubclass.HeldInOffHand,
        ],
    },
    // Paladin - Holy
    65: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Polearm,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
            WeaponSubclass.HeldInOffHand,
            WeaponSubclass.Shield,
        ],
    },
    // Paladin - Protection
    66: {
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Shield,
        ],
    },
    // Paladin - Retribution
    70: {
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.Polearm,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Priest - Discipline
    256: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.Stave,
            WeaponSubclass.Wand,
            WeaponSubclass.HeldInOffHand,
        ],
    },
    // Rogue - Assassination
    259: {
        dualWield: true,
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [WeaponSubclass.Dagger],
    },
    // Rogue - Outlaw
    260: {
        dualWield: true,
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
        ],
    },
    // Shaman - Elemental
    262: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.Stave,
            WeaponSubclass.HeldInOffHand,
            WeaponSubclass.Shield,
        ],
    },
    // Shaman - Enhancement
    263: {
        dualWield: true,
        primaryStat: PrimaryStat.Agility,
        weaponTypes: [
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
        ],
    },
    // Warlock - Affliction
    265: {
        primaryStat: PrimaryStat.Intellect,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Stave,
            WeaponSubclass.Wand,
            WeaponSubclass.HeldInOffHand,
            WeaponSubclass.Shield,
        ],
    },
    // Warrior - Arms
    71: {
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.Polearm,
            WeaponSubclass.Stave,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Warrior - Fury
    72: {
        dualWield: true,
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Polearm,
            WeaponSubclass.Stave,
            WeaponSubclass.TwoHandedAxe,
            WeaponSubclass.TwoHandedMace,
            WeaponSubclass.TwoHandedSword,
        ],
    },
    // Warrior - Protection
    73: {
        primaryStat: PrimaryStat.Strength,
        weaponTypes: [
            WeaponSubclass.Dagger,
            WeaponSubclass.Fist,
            WeaponSubclass.OneHandedAxe,
            WeaponSubclass.OneHandedMace,
            WeaponSubclass.OneHandedSword,
            WeaponSubclass.Shield,
        ],
    },
};

specializationData[252] = specializationData[250]; // Death Knight - Unholy = Blood
specializationData[104] = specializationData[103]; // Druid - Guardian = Feral
specializationData[105] = specializationData[102]; // Druid - Restoration = Balance
specializationData[254] = specializationData[253]; // Hunter - Marksmanship = Beast Mastery
specializationData[257] = specializationData[256]; // Priest - Holy = Discipline
specializationData[258] = specializationData[256]; // Hunter - Shadow = Discipline
specializationData[63] = specializationData[62]; // Mage - Fire = Arcane
specializationData[64] = specializationData[62]; // Mage - Frost = Arcane
specializationData[261] = specializationData[259]; // Rogue - Subtlety = Assassination
specializationData[264] = specializationData[262]; // Shaman - Restoration = Elemental
specializationData[266] = specializationData[265]; // Warlock - Demonology = Affliction
specializationData[267] = specializationData[265]; // Warlock - Destruction = Affliction
specializationData[269] = specializationData[268]; // Monk - Windwalker = Brewmaster
specializationData[581] = specializationData[577]; // Demon Hunter - Vengeance = Havoc
specializationData[1468] = specializationData[1467]; // Evoker - Preservation = Devastation
specializationData[1473] = specializationData[1467]; // Evoker - Augmentation = Devastation
