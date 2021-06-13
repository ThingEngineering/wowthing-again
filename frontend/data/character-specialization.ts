import { PlayableClass } from './playable-class'
import { Role } from './role'
import type { Dictionary, CharacterSpecialization } from '@/types'

export const specializationMap: Dictionary<CharacterSpecialization> = {
    // Death Knight
    250: {
        classId: PlayableClass.DeathKnight,
        role: Role.Tank,
        name: 'Blood',
        icon: 'spec_death_knight_blood',
    },
    251: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Frost',
        icon: 'spec_death_knight_frost',
    },
    252: {
        classId: PlayableClass.DeathKnight,
        role: Role.MeleeDps,
        name: 'Unholy',
        icon: 'spec_death_knight_unholy',
    },
    // Demon Hunter
    577: {
        classId: PlayableClass.DemonHunter,
        role: Role.MeleeDps,
        name: 'Havoc',
        icon: 'spec_demon_hunter_havoc',
    },
    581: {
        classId: PlayableClass.DemonHunter,
        role: Role.Tank,
        name: 'Vengeance',
        icon: 'spec_demon_hunter_vengeance',
    },
    // Druid
    102: {
        classId: PlayableClass.Druid,
        role: Role.RangedDps,
        name: 'Balance',
        icon: 'spec_druid_balance',
    },
    103: {
        classId: PlayableClass.Druid,
        role: Role.MeleeDps,
        name: 'Feral',
        icon: 'spec_druid_feral',
    },
    104: {
        classId: PlayableClass.Druid,
        role: Role.Tank,
        name: 'Guardian',
        icon: 'spec_druid_guardian',
    },
    105: {
        classId: PlayableClass.Druid,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_druid_restoration',
    },
    // Hunter
    253: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Beast Mastery',
        icon: 'spec_hunter_beast_mastery',
    },
    254: {
        classId: PlayableClass.Hunter,
        role: Role.RangedDps,
        name: 'Marksmanship',
        icon: 'spec_hunter_marksmanship',
    },
    255: {
        classId: PlayableClass.Hunter,
        role: Role.MeleeDps,
        name: 'Survival',
        icon: 'spec_hunter_survival',
    },
    // Mage
    62: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Arcane',
        icon: 'spec_mage_arcane',
    },
    63: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Fire',
        icon: 'spec_mage_fire',
    },
    64: {
        classId: PlayableClass.Mage,
        role: Role.RangedDps,
        name: 'Frost',
        icon: 'spec_mage_frost',
    },
    // Monk
    268: {
        classId: PlayableClass.Monk,
        role: Role.Tank,
        name: 'Brewmaster',
        icon: 'spec_monk_brewmaster',
    },
    269: {
        classId: PlayableClass.Monk,
        role: Role.MeleeDps,
        name: 'Windwalker',
        icon: 'spec_monk_windwalker',
    },
    270: {
        classId: PlayableClass.Monk,
        role: Role.Healer,
        name: 'Mistweaver',
        icon: 'spec_monk_mistweaver',
    },
    // Paladin
    65: {
        classId: PlayableClass.Paladin,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_paladin_holy',
    },
    66: {
        classId: PlayableClass.Paladin,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_paladin_protection',
    },
    70: {
        classId: PlayableClass.Paladin,
        role: Role.MeleeDps,
        name: 'Retribution',
        icon: 'spec_paladin_retribution',
    },
    // Priest
    256: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Discipline',
        icon: 'spec_priest_discipline',
    },
    257: {
        classId: PlayableClass.Priest,
        role: Role.Healer,
        name: 'Holy',
        icon: 'spec_priest_holy',
    },
    258: {
        classId: PlayableClass.Priest,
        role: Role.RangedDps,
        name: 'Shadow',
        icon: 'spec_priest_shadow',
    },
    // Rogue
    259: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Assassination',
        icon: 'spec_rogue_assassination',
    },
    260: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Outlaw',
        icon: 'spec_rogue_outlaw',
    },
    261: {
        classId: PlayableClass.Rogue,
        role: Role.MeleeDps,
        name: 'Subtlety',
        icon: 'spec_rogue_subtlety',
    },
    // Shaman
    262: {
        classId: PlayableClass.Shaman,
        role: Role.RangedDps,
        name: 'Elemental',
        icon: 'spec_shaman_elemental',
    },
    263: {
        classId: PlayableClass.Shaman,
        role: Role.MeleeDps,
        name: 'Enhancement',
        icon: 'spec_shaman_enhancement',
    },
    264: {
        classId: PlayableClass.Shaman,
        role: Role.Healer,
        name: 'Restoration',
        icon: 'spec_shaman_restoration',
    },
    // Warlock
    265: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Affliction',
        icon: 'spec_warlock_affliction',
    },
    266: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Demonology',
        icon: 'spec_warlock_demonology',
    },
    267: {
        classId: PlayableClass.Warlock,
        role: Role.RangedDps,
        name: 'Destruction',
        icon: 'spec_warlock_destruction',
    },
    // Warrior
    71: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Arms',
        icon: 'spec_warrior_arms',
    },
    72: {
        classId: PlayableClass.Warrior,
        role: Role.MeleeDps,
        name: 'Fury',
        icon: 'spec_warrior_fury',
    },
    73: {
        classId: PlayableClass.Warrior,
        role: Role.Tank,
        name: 'Protection',
        icon: 'spec_warrior_protection',
    },
}
