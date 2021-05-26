import {PlayableClass} from './playable-class'
import {Role} from './role'
import type {Dictionary} from '@/types'
import {Specialization} from '@/types'

const specializationMap: Dictionary<Specialization> = {
    // Death Knight
    250: new Specialization(PlayableClass.DeathKnight, Role.Tank, 'Blood', 'spec_death_knight_blood'),
    251: new Specialization(PlayableClass.DeathKnight, Role.MeleeDps, 'Frost', 'spec_death_knight_frost'),
    252: new Specialization(PlayableClass.DeathKnight, Role.MeleeDps, 'Unholy', 'spec_death_knight_unholy'),
    // Demon Hunter
    577: new Specialization(PlayableClass.DemonHunter, Role.MeleeDps, 'Havoc', 'spec_demon_hunter_havoc'),
    581: new Specialization(PlayableClass.DemonHunter, Role.Tank, 'Vengeance', 'spec_demon_hunter_vengeance'),
    // Druid
    102: new Specialization(PlayableClass.Druid, Role.RangedDps, 'Balance', 'spec_druid_balance'),
    103: new Specialization(PlayableClass.Druid, Role.MeleeDps, 'Feral', 'spec_druid_feral'),
    104: new Specialization(PlayableClass.Druid, Role.Tank, 'Guardian', 'spec_druid_guardian'),
    105: new Specialization(PlayableClass.Druid, Role.Healer, 'Restoration', 'spec_druid_restoration'),
    // Hunter
    253: new Specialization(PlayableClass.Hunter, Role.RangedDps, 'Beast Mastery', 'spec_hunter_beast_mastery'),
    254: new Specialization(PlayableClass.Hunter, Role.RangedDps, 'Marksmanship', 'spec_hunter_marksmanship'),
    255: new Specialization(PlayableClass.Hunter, Role.MeleeDps, 'Survival', 'spec_hunter_survival'),
    // Mage
    62: new Specialization(PlayableClass.Mage, Role.RangedDps, 'Arcane', 'spec_mage_arcane'),
    63: new Specialization(PlayableClass.Mage, Role.RangedDps, 'Fire', 'spec_mage_fire'),
    64: new Specialization(PlayableClass.Mage, Role.RangedDps, 'Frost', 'spec_mage_frost'),
    // Monk
    268: new Specialization(PlayableClass.Monk, Role.Tank, 'Brewmaster', 'spec_monk_brewmaster'),
    269: new Specialization(PlayableClass.Monk, Role.MeleeDps, 'Windwalker', 'spec_monk_windwalker'),
    270: new Specialization(PlayableClass.Monk, Role.Healer, 'Mistweaver', 'spec_monk_mistweaver'),
    // Paladin
    65: new Specialization(PlayableClass.Paladin, Role.Healer, 'Holy', 'spec_paladin_holy'),
    66: new Specialization(PlayableClass.Paladin, Role.Tank, 'Protection', 'spec_paladin_protection'),
    70: new Specialization(PlayableClass.Paladin, Role.MeleeDps, 'Retribution', 'spec_paladin_retribution'),
    // Priest
    256: new Specialization(PlayableClass.Priest, Role.Healer, 'Discipline', 'spec_priest_discipline'),
    257: new Specialization(PlayableClass.Priest, Role.Healer, 'Holy', 'spec_priest_holy'),
    258: new Specialization(PlayableClass.Priest, Role.RangedDps, 'Shadow', 'spec_priest_shadow'),
    // Rogue
    259: new Specialization(PlayableClass.Rogue, Role.MeleeDps, 'Assassination', 'spec_rogue_assassination'),
    260: new Specialization(PlayableClass.Rogue, Role.MeleeDps, 'Outlaw', 'spec_rogue_outlaw'),
    261: new Specialization(PlayableClass.Rogue, Role.MeleeDps, 'Subtlety', 'spec_rogue_subtlety'),
    // Shaman
    262: new Specialization(PlayableClass.Shaman, Role.RangedDps, 'Elemental', 'spec_shaman_elemental'),
    263: new Specialization(PlayableClass.Shaman, Role.MeleeDps, 'Enhancement', 'spec_shaman_enhancement'),
    264: new Specialization(PlayableClass.Shaman, Role.Healer, 'Restoration', 'spec_shaman_restoration'),
    // Warlock
    265: new Specialization(PlayableClass.Warlock, Role.RangedDps, 'Affliction', 'spec_warlock_affliction'),
    266: new Specialization(PlayableClass.Warlock, Role.RangedDps, 'Demonology', 'spec_warlock_demonology'),
    267: new Specialization(PlayableClass.Warlock, Role.RangedDps, 'Destruction', 'spec_warlock_destruction'),
    // Warrior
    71: new Specialization(PlayableClass.Warrior, Role.MeleeDps, 'Arms', 'spec_warrior_arms'),
    72: new Specialization(PlayableClass.Warrior, Role.MeleeDps, 'Fury', 'spec_warrior_fury'),
    73: new Specialization(PlayableClass.Warrior, Role.Tank, 'Protection', 'spec_warrior_protection'),
}

export {
    specializationMap
}
