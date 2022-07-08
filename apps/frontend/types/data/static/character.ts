import type { Faction, PrimaryStat, Role } from '@/types/enums'


export interface StaticDataCharacterClass {
    armorMask: number
    id: number
    name: string
    rolesMask: number
    slug: string

    // calculated
    mask: number
    specializationIds: number[]
}

export interface StaticDataCharacterRace {
    faction: Faction
    id: number
    name: string
}

export interface StaticDataCharacterSpecialization {
    classId: number
    id: number
    name: string
    order: number
    primaryStat: PrimaryStat
    role: Role
}
