import {PrimaryStat, PlayableClass, Role} from '@/types/enums'
import type { CharacterSpecialization } from '@/types'

export const specializationMap: Record<number, CharacterSpecialization> = {
    // Death Knight
    250: {
        classId: PlayableClass.DeathKnight,
        role: Role.Tank,
        name: 'Blood',
        icon: 'spec_death_knight_blood',
        mainStat: PrimaryStat.Strength,
    },
    251: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Frost',
        icon: 'spec_death_knight_frost',
        mainStat: PrimaryStat.Strength,
    },
    252: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Unholy',
        icon: 'spec_death_knight_unholy',
        mainStat: PrimaryStat.Strength,
    },

    // Demon Hunter
    577: {
        classId: PlayableClass.DemonHunter,
        role: Role.MeleeDps,
        name: 'Havoc',
        icon: 'spec_demon_hunter_havoc',
        mainStat: PrimaryStat.Agility,
    },
    581: {
        classId: PlayableClass.DemonHunter,
        role: Role.Tank,
        name: 'Vengeance',
        icon: 'spec_demon_hunter_vengeance',
        mainStat: PrimaryStat.Agility,
    },

    // Druid
    102: {
        classId: PlayableClass.Druid,
        role: Role.RangedDps,
        name: 'Balance',
        icon: 'spec_druid_balance',
        mainStat: PrimaryStat.Intellect,
    },
    103: {
        classId: PlayableClass.Druid,
        role: Role.MeleeDps,
        name: 'Feral',
        icon: 'spec_druid_feral',
        mainStat: PrimaryStat.Agility,
    },
    104: {
        classId: PlayableClass.Druid,
        role: Role.Tank,
        name: 'Guardian',
        icon: 'spec_druid_guardian',
        mainStat: PrimaryStat.Agility,
    },
    105: {
        classId: PlayableClass.Druid,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_druid_restoration',
        mainStat: PrimaryStat.Intellect,
    },

    // Hunter
    253: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Beast Mastery',
        icon: 'spec_hunter_beast_mastery',
        mainStat: PrimaryStat.Agility,
    },
    254: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Marksmanship',
        icon: 'spec_hunter_marksmanship',
        mainStat: PrimaryStat.Agility,
    },
    255: {
        classId: PlayableClass.Hunter,
        role: Role.MeleeDps,
        name: 'Survival',
        icon: 'spec_hunter_survival',
        mainStat: PrimaryStat.Agility,
    },

    // Mage
    62: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Arcane',
        icon: 'spec_mage_arcane',
        mainStat: PrimaryStat.Intellect,
    },
    63: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Fire',
        icon: 'spec_mage_fire',
        mainStat: PrimaryStat.Intellect,
    },
    64: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Frost',
        icon: 'spec_mage_frost',
        mainStat: PrimaryStat.Intellect,
    },

    // Monk
    268: {
        classId: PlayableClass.Monk,
        role: Role.Tank,
        name: 'Brewmaster',
        icon: 'spec_monk_brewmaster',
        mainStat: PrimaryStat.Agility,
    },
    269: {
        classId: PlayableClass.Monk,
        role: Role.MeleeDps,
        name: 'Windwalker',
        icon: 'spec_monk_windwalker',
        mainStat: PrimaryStat.Agility,
    },
    270: {
        classId: PlayableClass.Monk,
        role: Role.Healer,
        name: 'Mistweaver',
        icon: 'spec_monk_mistweaver',
        mainStat: PrimaryStat.Intellect,
    },

    // Paladin
    65: {
        classId: PlayableClass.Paladin,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_paladin_holy',
        mainStat: PrimaryStat.Intellect,
    },
    66: {
        classId: PlayableClass.Paladin,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_paladin_protection',
        mainStat: PrimaryStat.Strength,
    },
    70: {
        classId: PlayableClass.Paladin,
        role: Role.MeleeDps,
        name: 'Retribution',
        icon: 'spec_paladin_retribution',
        mainStat: PrimaryStat.Strength,
    },

    // Priest
    256: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Discipline',
        icon: 'spec_priest_discipline',
        mainStat: PrimaryStat.Intellect,
    },
    257: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_priest_holy',
        mainStat: PrimaryStat.Intellect,
    },
    258: {
        classId: PlayableClass.Priest,
        role: Role.RangedDps,
        name: 'Shadow',
        icon: 'spec_priest_shadow',
        mainStat: PrimaryStat.Intellect,
    },

    // Rogue
    259: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Assassination',
        icon: 'spec_rogue_assassination',
        mainStat: PrimaryStat.Agility,
    },
    260: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Outlaw',
        icon: 'spec_rogue_outlaw',
        mainStat: PrimaryStat.Agility,
    },
    261: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Subtlety',
        icon: 'spec_rogue_subtlety',
        mainStat: PrimaryStat.Agility,
    },

    // Shaman
    262: {
        classId: PlayableClass.Shaman,
        role: Role.RangedDps,
        name: 'Elemental',
        icon: 'spec_shaman_elemental',
        mainStat: PrimaryStat.Intellect,
    },
    263: {
        classId: PlayableClass.Shaman,
        role: Role.MeleeDps,
        name: 'Enhancement',
        icon: 'spec_shaman_enhancement',
        mainStat: PrimaryStat.Agility,
    },
    264: {
        classId: PlayableClass.Shaman,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_shaman_restoration',
        mainStat: PrimaryStat.Intellect,
    },

    // Warlock
    265: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Affliction',
        icon: 'spec_warlock_affliction',
        mainStat: PrimaryStat.Intellect,
    },
    266: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Demonology',
        icon: 'spec_warlock_demonology',
        mainStat: PrimaryStat.Intellect,
    },
    267: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Destruction',
        icon: 'spec_warlock_destruction',
        mainStat: PrimaryStat.Intellect,
    },

    // Warrior
    71: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Arms',
        icon: 'spec_warrior_arms',
        mainStat: PrimaryStat.Strength,
    },
    72: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Fury',
        icon: 'spec_warrior_fury',
        mainStat: PrimaryStat.Strength,
    },
    73: {
        classId: PlayableClass.Warrior,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_warrior_protection',
        mainStat: PrimaryStat.Strength,
    },
}
