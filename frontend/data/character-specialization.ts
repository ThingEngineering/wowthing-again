import {MainStat, PlayableClass, Role} from '@/types/enums'
import type { CharacterSpecialization, Dictionary } from '@/types'

export const specializationMap: Dictionary<CharacterSpecialization> = {
    // Death Knight
    250: {
        classId: PlayableClass.DeathKnight,
        role: Role.Tank,
        name: 'Blood',
        icon: 'spec_death_knight_blood',
        mainStat: MainStat.Strength,
    },
    251: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Frost',
        icon: 'spec_death_knight_frost',
        mainStat: MainStat.Strength,
    },
    252: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Unholy',
        icon: 'spec_death_knight_unholy',
        mainStat: MainStat.Strength,
    },

    // Demon Hunter
    577: {
        classId: PlayableClass.DemonHunter,
        role: Role.MeleeDps,
        name: 'Havoc',
        icon: 'spec_demon_hunter_havoc',
        mainStat: MainStat.Agility,
    },
    581: {
        classId: PlayableClass.DemonHunter,
        role: Role.Tank,
        name: 'Vengeance',
        icon: 'spec_demon_hunter_vengeance',
        mainStat: MainStat.Agility,
    },

    // Druid
    102: {
        classId: PlayableClass.Druid,
        role: Role.RangedDps,
        name: 'Balance',
        icon: 'spec_druid_balance',
        mainStat: MainStat.Intellect,
    },
    103: {
        classId: PlayableClass.Druid,
        role: Role.MeleeDps,
        name: 'Feral',
        icon: 'spec_druid_feral',
        mainStat: MainStat.Agility,
    },
    104: {
        classId: PlayableClass.Druid,
        role: Role.Tank,
        name: 'Guardian',
        icon: 'spec_druid_guardian',
        mainStat: MainStat.Agility,
    },
    105: {
        classId: PlayableClass.Druid,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_druid_restoration',
        mainStat: MainStat.Intellect,
    },

    // Hunter
    253: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Beast Mastery',
        icon: 'spec_hunter_beast_mastery',
        mainStat: MainStat.Agility,
    },
    254: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Marksmanship',
        icon: 'spec_hunter_marksmanship',
        mainStat: MainStat.Agility,
    },
    255: {
        classId: PlayableClass.Hunter,
        role: Role.MeleeDps,
        name: 'Survival',
        icon: 'spec_hunter_survival',
        mainStat: MainStat.Agility,
    },

    // Mage
    62: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Arcane',
        icon: 'spec_mage_arcane',
        mainStat: MainStat.Intellect,
    },
    63: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Fire',
        icon: 'spec_mage_fire',
        mainStat: MainStat.Intellect,
    },
    64: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Frost',
        icon: 'spec_mage_frost',
        mainStat: MainStat.Intellect,
    },

    // Monk
    268: {
        classId: PlayableClass.Monk,
        role: Role.Tank,
        name: 'Brewmaster',
        icon: 'spec_monk_brewmaster',
        mainStat: MainStat.Agility,
    },
    269: {
        classId: PlayableClass.Monk,
        role: Role.MeleeDps,
        name: 'Windwalker',
        icon: 'spec_monk_windwalker',
        mainStat: MainStat.Agility,
    },
    270: {
        classId: PlayableClass.Monk,
        role: Role.Healer,
        name: 'Mistweaver',
        icon: 'spec_monk_mistweaver',
        mainStat: MainStat.Intellect,
    },

    // Paladin
    65: {
        classId: PlayableClass.Paladin,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_paladin_holy',
        mainStat: MainStat.Intellect,
    },
    66: {
        classId: PlayableClass.Paladin,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_paladin_protection',
        mainStat: MainStat.Strength,
    },
    70: {
        classId: PlayableClass.Paladin,
        role: Role.MeleeDps,
        name: 'Retribution',
        icon: 'spec_paladin_retribution',
        mainStat: MainStat.Strength,
    },

    // Priest
    256: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Discipline',
        icon: 'spec_priest_discipline',
        mainStat: MainStat.Intellect,
    },
    257: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_priest_holy',
        mainStat: MainStat.Intellect,
    },
    258: {
        classId: PlayableClass.Priest,
        role: Role.RangedDps,
        name: 'Shadow',
        icon: 'spec_priest_shadow',
        mainStat: MainStat.Intellect,
    },

    // Rogue
    259: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Assassination',
        icon: 'spec_rogue_assassination',
        mainStat: MainStat.Agility,
    },
    260: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Outlaw',
        icon: 'spec_rogue_outlaw',
        mainStat: MainStat.Agility,
    },
    261: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Subtlety',
        icon: 'spec_rogue_subtlety',
        mainStat: MainStat.Agility,
    },

    // Shaman
    262: {
        classId: PlayableClass.Shaman,
        role: Role.RangedDps,
        name: 'Elemental',
        icon: 'spec_shaman_elemental',
        mainStat: MainStat.Intellect,
    },
    263: {
        classId: PlayableClass.Shaman,
        role: Role.MeleeDps,
        name: 'Enhancement',
        icon: 'spec_shaman_enhancement',
        mainStat: MainStat.Agility,
    },
    264: {
        classId: PlayableClass.Shaman,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_shaman_restoration',
        mainStat: MainStat.Intellect,
    },

    // Warlock
    265: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Affliction',
        icon: 'spec_warlock_affliction',
        mainStat: MainStat.Intellect,
    },
    266: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Demonology',
        icon: 'spec_warlock_demonology',
        mainStat: MainStat.Intellect,
    },
    267: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Destruction',
        icon: 'spec_warlock_destruction',
        mainStat: MainStat.Intellect,
    },

    // Warrior
    71: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Arms',
        icon: 'spec_warrior_arms',
        mainStat: MainStat.Strength,
    },
    72: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Fury',
        icon: 'spec_warrior_fury',
        mainStat: MainStat.Strength,
    },
    73: {
        classId: PlayableClass.Warrior,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_warrior_protection',
        mainStat: MainStat.Strength,
    },
}
