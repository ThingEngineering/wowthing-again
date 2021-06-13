import type { Dictionary } from '@/types'

export interface MountSkill {
    allianceSpellId: number
    hordeSpellId: number
    price: number
    requiredLevel: number
    speed: number
}

export const mountSkillMap: Dictionary<MountSkill> = {
    1: {
        allianceSpellId: 458,
        hordeSpellId: 459,
        price: 0.1,
        requiredLevel: 10,
        speed: 60,
    },
    2: {
        allianceSpellId: 458,
        hordeSpellId: 459,
        price: 50,
        requiredLevel: 20,
        speed: 100,
    },
    3: {
        allianceSpellId: 32235, // Golden Gryphon
        hordeSpellId: 32243, // Tawny Wind Rider
        price: 250,
        requiredLevel: 30,
        speed: 150,
    },
    // deprecated
    4: {
        allianceSpellId: 32242, // Swift Blue Gryphon
        hordeSpellId: 32246, // Swift Red Wind Rider
        price: 0,
        requiredLevel: -1,
        speed: 280,
    },
    5: {
        allianceSpellId: 32242, // Swift Blue Gryphon
        hordeSpellId: 32246, // Swift Red Wind Rider
        price: 5000,
        requiredLevel: 40,
        speed: 310,
    },
}
