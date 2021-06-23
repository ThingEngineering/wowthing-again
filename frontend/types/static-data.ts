import type { Dictionary } from './dictionary'

export interface StaticData {
    realms: Dictionary<StaticDataRealm>
    reputations: Dictionary<StaticDataReputation>
    reputationTiers: Dictionary<StaticDataReputationTier>

    mountSets: StaticDataSetCategory[][]
    spellToMount: Dictionary<number>

    petSets: StaticDataSetCategory[][]
    creatureToPet: Dictionary<number>

    reputationSets: StaticDataReputationCategory[]

    toySets: StaticDataSetCategory[][]

    raiderIoScoreTiers: StaticDataRaiderIoScoreTier[]
}

interface StaticDataRealm {
    id: number
    region: number
    name: string
    slug: string
}

// Reputations
export interface StaticDataReputation {
    id: number
    name: string
    tierId: number
}

export interface StaticDataReputationTier {
    id: number
    minValues: number[]
    maxValues: number[]
    names: string[]
}

interface StaticDataReputationCategory {
    name: string
    reputations: StaticDataReputationSet[][]
    slug: string
}

export interface StaticDataReputationSet {
    both: StaticDataReputationReputation
    alliance: StaticDataReputationReputation
    horde: StaticDataReputationReputation
    paragon: boolean
}

interface StaticDataReputationReputation {
    id: number
    name: string
    icon: string
    note: string
}

// Sets
export interface StaticDataSetCategory {
    name: string
    slug: string
    groups: StaticDataSetGroup[]
}

export interface StaticDataSetGroup {
    name: string
    things: number[][]
}

// RaiderIO
export interface StaticDataRaiderIoScoreTier {
    score: number
    rgbHex: string
}
