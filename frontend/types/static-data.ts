import type { ZoneMapDataCategory } from '@/types/data'


export interface StaticData {
    currencies: Record<number, StaticDataCurrency>
    currenciesRaw: StaticDataCurrencyArray[]

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    realms: Record<number, StaticDataRealm>
    realmsRaw: StaticDataRealmArray[]

    reputations: Record<number, StaticDataReputation>
    reputationsRaw: StaticDataReputationArray[]

    currencyCategories: Record<number, StaticDataCurrencyCategory>
    progress: StaticDataProgressCategory[][]
    reputationTiers: Record<number, StaticDataReputationTier>

    mountSets: StaticDataSetCategory[][]
    mountSetsRaw: StaticDataSetCategoryArray[][]
    spellToMount: Record<number, number>

    petSets: StaticDataSetCategory[][]
    petSetsRaw: StaticDataSetCategoryArray[][]
    creatureToPet: Record<number, number>

    toySets: StaticDataSetCategory[][]
    toySetsRaw: StaticDataSetCategoryArray[][]

    reputationSets: StaticDataReputationCategory[]

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

export class StaticDataRealm {
    constructor(
        public id: number,
        public region: number,
        public name: string,
        public slug: string
    )
    { }
}

type StaticDataRealmArray = ConstructorParameters<typeof StaticDataRealm>

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
export class StaticDataReputation {
    constructor(
        public id: number,
        public name: string,
        public tierId: number
    )
    { }
}

type StaticDataReputationArray = ConstructorParameters<typeof StaticDataReputation>

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
export class StaticDataSetCategory {
    public name: string
    public slug: string
    public groups: StaticDataSetGroup[]

    constructor(
        name: string,
        slug: string,
        groups: StaticDataSetGroupArray[]
    )
    {
        this.name = name
        this.slug = slug
        this.groups = groups.map((groupArray) => new StaticDataSetGroup(...groupArray))
    }
}

export type StaticDataSetCategoryArray = ConstructorParameters<typeof StaticDataSetCategory>

export class StaticDataSetGroup {
    constructor(
        public name: string,
        public things: number[][]
    )
    { }
}

type StaticDataSetGroupArray = ConstructorParameters<typeof StaticDataSetGroup>

// RaiderIO
export interface StaticDataRaiderIoScoreTiers {
    score: number[]
    rgbHex: string[]
}
