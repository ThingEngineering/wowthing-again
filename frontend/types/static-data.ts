import type { ZoneMapDataCategory } from '@/types/data'


export interface StaticData {
    currencies: Record<number, StaticDataCurrency>
    currenciesRaw: StaticDataCurrencyArray[]

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    currencyCategories: Record<number, StaticDataCurrencyCategory>
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

    zoneMapSets: ZoneMapDataCategory[][]

    raiderIoScoreTiers: Record<number, StaticDataRaiderIoScoreTiers>
}

export class StaticDataCurrency {
    constructor(
        public id: number,
        public categoryId: number,
        public maxPerWeek: number,
        public maxTotal: number,
        public name: string
    )
    { }
}

type StaticDataCurrencyArray = ConstructorParameters<typeof StaticDataCurrency>

export interface StaticDataCurrencyCategory {
    id: number
    name: string
    slug: string
}

export class StaticDataInstance {
    constructor(
        public id: number,
        public expansion: number,
        public name: string,
        public shortName: string
    )
    { }
}

type StaticDataInstanceArray = ConstructorParameters<typeof StaticDataInstance>

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
