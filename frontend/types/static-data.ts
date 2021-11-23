export interface StaticData {
    currencies: Record<number, StaticDataCurrency>
    currencyCategories: Record<number, StaticDataCurrencyCategory>
    instances: Record<number, StaticDataInstance>
    progress: StaticDataProgressCategory[][]
    realms: Record<number, StaticDataRealm>
    reputations: Record<number, StaticDataReputation>
    reputationTiers: Record<number, StaticDataReputationTier>

    mountSets: StaticDataSetCategory[][]
    spellToMount: Record<number, number>

    petSets: StaticDataSetCategory[][]
    creatureToPet: Record<number, number>

    reputationSets: StaticDataReputationCategory[]

    toySets: StaticDataSetCategory[][]

    raiderIoScoreTiers: Record<number, StaticDataRaiderIoScoreTiers>
}

export interface StaticDataCurrency {
    id: number
    categoryId: number
    description: string
    maxPerWeek: number
    maxTotal: number
    name: string
}

export interface StaticDataCurrencyCategory {
    id: number
    name: string
    slug: string
}

export interface StaticDataInstance {
    expansion: number
    id: number
    name: string
    shortName: string
}

export interface StaticDataRealm {
    id: number
    region: number
    name: string
    slug: string
}

// Progress
export interface StaticDataProgressCategory {
    name: string
    slug: string
    requiredQuestIds: number[]
    groups: StaticDataProgressGroup[]
}

export interface StaticDataProgressGroup {
    icon: string
    lookup: string
    name: string
    type: string
    data: Record<string, StaticDataProgressData[]>
}

export interface StaticDataProgressData {
    ids: number[]
    description?: string
    name: string
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

export interface StaticDataReputationCategory {
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

export interface StaticDataReputationReputation {
    id: number
    name: string
    icon: string
    note: string
    rewards: StaticDataReputationReward[]
}

export interface StaticDataReputationReward {
    id: number
    name: string
    type: string
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
export interface StaticDataRaiderIoScoreTiers {
    score: number[]
    rgbHex: string[]
}
